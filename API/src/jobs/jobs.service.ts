import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
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
      jobStatus: JobStatus.Processing,
      paymentUrl: '',
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

  async updateJobStatus(jobId: string): Promise<void> {
    try {
      const job = await this.jobModel.findOne({ _id: jobId });

      if (!job) {
        throw new Error(`Job not found with id: ${jobId}`);
      }

      job.jobStatus = JobStatus.Pending;
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

    if (job.jobStatus !== 'PENDING') {
      throw new BadRequestException(
        'Cannot cancel the order. The job is not in the PENDING status.',
      );
    }

    job.jobStatus = JobStatus.Cancelled;
    

    const cancelledJob = await this.findOne(id);
    const refundAmount = cancelledJob.price * 0.95;
    // Render cancellation email content
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

  update(id: number, updateJobDto: UpdateJobDto) {
    return `This action updates a #${id} job`;
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }
}
