import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Offer } from 'src/offers/entities/offer.entity';
import { Job, JobDocument } from './entities/job.entity';
import { User } from 'src/user/entities/user.entity';
import { JobStatus } from 'src/Types/jobs.types';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaypalService } from 'src/paypal/paypal.service';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    private paypalService: PaypalService,
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

  update(id: number, updateJobDto: UpdateJobDto) {
    return `This action updates a #${id} job`;
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }
}
