import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  async findAll(filter: {
    worker?: Types.ObjectId;
    service?: Types.ObjectId;
    customer?: Types.ObjectId;
  }): Promise<Feedback[]> {
    return this.feedbackModel
      .find(filter)
      .populate('customer')
      .populate('worker')
      .populate('service')
      .exec();
  }

  async findOne(id: string): Promise<Feedback> {
    const feedback = await this.feedbackModel
      .findById(id)
      .populate('customer')
      .populate('worker')
      .populate('service')
      .exec();

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID "${id}" not found`);
    }

    return feedback;
  }

  async findAvgRatingByWorker(workerId: string): Promise<number> {
    const result = await this.feedbackModel.aggregate([
      { $match: { worker: new Types.ObjectId(workerId) } },
      {
        $group: {
          _id: '$worker',
          avgRating: { $avg: '$stars' },
        },
      },
      {
        $project: {
          avgRating: {
            $switch: {
              branches: [
                { case: { $lt: ['$avgRating', 0.5] }, then: 0 },
                { case: { $lt: ['$avgRating', 1.5] }, then: 1 },
                { case: { $lt: ['$avgRating', 2.5] }, then: 2 },
                { case: { $lt: ['$avgRating', 3.5] }, then: 3 },
                { case: { $lt: ['$avgRating', 4.5] }, then: 4 },
                { case: { $gte: ['$avgRating', 4.5] }, then: 5 },
              ],
              default: 0,
            },
          },
        },
      },
    ]);

    if (result.length > 0 && result[0].avgRating !== null) {
      return result[0].avgRating;
    } else {
      return 0;
    }
  }
}
