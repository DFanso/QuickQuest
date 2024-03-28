import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Offer } from 'src/offers/entities/offer.entity';
import { Job, JobDocument } from './entities/job.entity';
import { User } from 'src/user/entities/user.entity';
import { JobStatus } from 'src/Types/jobs.types';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private jobModel: Model<JobDocument>) {}

  async create(offer: Offer, customer: User): Promise<Job> {
    const createJobDto: CreateJobDto = {
      service: offer.service,
      customer: customer,
      worker: offer.worker,
      description: offer.description,
      price: offer.price,
      orderedDate: new Date(),
      jobStatus: JobStatus.Processing,
    };

    const createdJob = new this.jobModel(createJobDto);
    return createdJob.save();
  }

  findAll() {
    return `This action returns all jobs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} job`;
  }

  update(id: number, updateJobDto: UpdateJobDto) {
    return `This action updates a #${id} job`;
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }
}
