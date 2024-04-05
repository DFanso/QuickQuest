import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { FeedbacksService } from 'src/feedbacks/feedbacks.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class WorkersService {
  constructor(
    private readonly userService: UserService,
    private readonly feedbacksService: FeedbacksService,
  ) {}

  findNearBy(userId: string, serviceId?: string) {
    const workers = this.userService.findNearByWorkers(userId, serviceId);
    return workers;
  }

  async workerProfile(workerId: string) {
    const workerProfileDoc = await this.userService.findOne({ _id: workerId });

    if (!workerProfileDoc) {
      throw new Error('Worker not found');
    }
    const workerProfile = workerProfileDoc.toObject();

    const feedbackSummary =
      await this.feedbacksService.findAvgRatingByWorker(workerId);

    const feedbacks = await this.feedbacksService.findAll({
      worker: new Types.ObjectId(workerId),
    });

    return {
      ...workerProfile,
      feedbacks,
      feedbackSummary,
    };
  }

  findAll() {
    return `This action returns all workers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} worker`;
  }

  remove(id: number) {
    return `This action removes a #${id} worker`;
  }
}
