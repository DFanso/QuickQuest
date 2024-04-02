import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { Offer } from 'src/offers/entities/offer.entity';
import { Job, JobDocument } from './entities/job.entity';
import { User } from 'src/user/entities/user.entity';
import { JobStatus } from 'src/Types/jobs.types';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaypalService } from 'src/paypal/paypal.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    private paypalService: PaypalService,
    private readonly emailService: EmailService,
  ) {}

  async create(offer: Offer, customer: User): Promise<Job> {
    const createJobDto: CreateJobDto = {
      service: offer.service,
      customer: customer,
      worker: offer.worker,
      description: offer.description,
      price: offer.price,
      orderedDate: new Date(),
      deliveryDate: offer.deliveryDate,
      status: JobStatus.Processing,
      paymentUrl: '',
      paypalOrderId: '',
    };

    const createdJob = new this.jobModel(createJobDto);
    await createdJob.save();

    // Populate the service name
    await createdJob.populate('service', 'name');

    // Create a PayPal payment
    const paymentDetails = {
      name: createdJob.service.name,
      unit_price: offer.price.toString(),
      quantity: '1',
      jobId: createdJob._id.toString(),
    };

    const approvalUrl = await this.paypalService.createJob(paymentDetails);

    // Update the job with the payment URL
    createdJob.paymentUrl = approvalUrl;
    await createdJob.save();

    return createdJob;
  }

  async updateJobStatus(jobId: string, paypalCaptureId): Promise<void> {
    try {
      const job = await this.jobModel.findOne({ _id: jobId });

      if (!job) {
        throw new Error(`Job not found with id: ${jobId}`);
      }

      job.status = JobStatus.Pending;
      job.paypalOrderId = paypalCaptureId;
      await job.save();
    } catch (error) {
      throw new Error(`Error updating job status: ${error.message}`);
    }
  }

  findAll() {
    return `This action returns all jobs`;
  }

  async findOne(id: string): Promise<Job> {
    return this.jobModel
      .findById(id)
      .populate({
        path: 'customer',
        model: 'User',
      })
      .populate({
        path: 'worker',
        model: 'User',
      })
      .populate('service')
      .exec();
  }

  async cancelOrder(id: string): Promise<void> {
    const job = await this.jobModel.findById(id);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const currentDate = new Date();
    const orderedDate = job.orderedDate;
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 1 day in milliseconds

    if (currentDate.getTime() - orderedDate.getTime() > oneDayInMilliseconds) {
      throw new BadRequestException(
        'Cannot cancel the order. The job is more than one day old.',
      );
    }

    if (job.status !== JobStatus.Pending) {
      throw new BadRequestException(
        'Cannot cancel the order. The job is not in the PENDING status.',
      );
    }

    job.status = JobStatus.Cancelled;

    const cancelledJob = await this.findOne(id);
    const refundAmount = cancelledJob.price * 0.95;

    await this.paypalService.refundPayment(
      cancelledJob.paypalOrderId,
      refundAmount,
    );

    //Render cancellation email content
    const emailContent = await this.emailService.renderTemplate(
      'customer-job-cancellation.hbs',
      {
        customerName:
          cancelledJob.customer.firstName +
          ' ' +
          cancelledJob.customer.lastName,
        orderID: id,
        serviceName: cancelledJob.service.name,
        description: cancelledJob.service.description,
        price: cancelledJob.price,
        orderedDate: cancelledJob.orderedDate.toISOString(),
        cancellationReason: 'Customer requested cancellation',
        refundAmount: refundAmount,
      },
    );

    const workerEmailContent = await this.emailService.renderTemplate(
      'worker-job-cancellation.hbs',
      {
        workerName:
          cancelledJob.worker.firstName + ' ' + cancelledJob.worker.lastName,
        orderID: id,
        serviceName: cancelledJob.service.name,
        description: cancelledJob.service.description,
        price: cancelledJob.price,
        orderedDate: cancelledJob.orderedDate.toISOString(),
        customerName:
          cancelledJob.customer.firstName +
          ' ' +
          cancelledJob.customer.lastName,
        cancellationReason: 'Customer requested cancellation',
      },
    );

    // Send cancellation email
    await this.emailService.sendEmail(
      [cancelledJob.customer.email],
      'Order Cancellation Confirmation',
      emailContent,
    );

    await this.emailService.sendEmail(
      [cancelledJob.worker.email],
      'Job Cancellation Notification',
      workerEmailContent,
    );

    await job.save();
  }

  async completeJob(jobId: string): Promise<void> {
    const job = await this.jobModel.findById(jobId);
    if (!job) {
      throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    }

    if (job.status == JobStatus.Processing) {
      throw new HttpException(
        'Job is in the PROCESSING state',
        HttpStatus.BAD_REQUEST,
      );
    }

    job.status = JobStatus.Completed;

    const completedJob = await this.findOne(jobId);

    const orderValue = completedJob.price;
    const workerShare = orderValue * 0.9;

    this.paypalService.sendPayoutToWorker(
      completedJob.worker.paypalEmail,
      workerShare,
    );

    const emailContent = await this.emailService.renderTemplate(
      'customer-order-completion.hbs',
      {
        customerName:
          completedJob.customer.firstName +
          ' ' +
          completedJob.customer.lastName,
        orderID: jobId,
        serviceName: completedJob.service.name,
        description: completedJob.service.description,
        price: completedJob.price,
        orderedDate: completedJob.orderedDate.toISOString(),
        workerName:
          completedJob.worker.firstName + ' ' + completedJob.worker.lastName,
      },
    );

    // Calculate the worker's payment amount (90% of the total price)
    const workerPayment = completedJob.price * 0.9;

    // Render email content for worker
    const workerEmailContent = await this.emailService.renderTemplate(
      'worker-order-completion.hbs',
      {
        workerName:
          completedJob.worker.firstName + ' ' + completedJob.worker.lastName,
        orderID: jobId,
        serviceName: completedJob.service.name,
        description: completedJob.service.description,
        price: completedJob.price,
        workerPayment: workerPayment.toFixed(2), // Format the worker's payment amount to two decimal places
        orderedDate: completedJob.orderedDate.toISOString(),
        customerName:
          completedJob.customer.firstName +
          ' ' +
          completedJob.customer.lastName,
      },
    );

    await this.emailService.sendEmail(
      [completedJob.customer.email],
      'Order Completion Notification',
      emailContent,
    );

    await this.emailService.sendEmail(
      [completedJob.worker.email],
      'Job Completed - Congratulations!',
      workerEmailContent,
    );

    await job.save();
  }

  async getJobsNearingDelivery(): Promise<Job[]> {
    const reminderDays = 1;

    // Calculate the date range for jobs nearing delivery
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + reminderDays);

    // Query the database to find jobs with delivery dates within the range
    const jobsNearingDelivery = await this.jobModel
      .find({
        deliveryDate: {
          $gte: startDate,
          $lte: endDate,
        },
        jobStatus: JobStatus.Pending,
      })
      .populate('worker', 'firstName lastName email')
      .populate('customer', 'firstName lastName email')
      .populate('service', 'name description');

    return jobsNearingDelivery;
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }
}
