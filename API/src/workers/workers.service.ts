import { Injectable } from '@nestjs/common';
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

  async findWorkerProfileWithRating(workerId: string) {
    const workerProfileDoc = await this.userService.findOne({ _id: workerId });

    if (!workerProfileDoc) {
      throw new Error('Worker not found');
    }
    const workerProfile = workerProfileDoc.toObject();

    const avgRating =
      await this.feedbacksService.findAvgRatingByWorker(workerId);

    return {
      ...workerProfile,
      avgRating,
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
