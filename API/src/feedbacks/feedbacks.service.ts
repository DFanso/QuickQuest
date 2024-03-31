import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Feedback, FeedbackDocument } from './entities/feedback.entity';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectModel(Feedback.name) private feedbackModel: Model<FeedbackDocument>,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const createdFeedback = new this.feedbackModel(createFeedbackDto);
    return createdFeedback.save();
  }

  async findAll(): Promise<Feedback[]> {
    return this.feedbackModel.find().exec();
  }

  async findOne(id: string): Promise<Feedback> {
    const feedback = await this.feedbackModel.findById(id).exec();
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID "${id}" not found`);
    }
    return feedback;
  }
}