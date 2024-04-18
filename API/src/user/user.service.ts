import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ClsService } from 'nestjs-cls';
import { AppClsStore, UserStatus, UserType } from '../Types/user.types';
import { FeedbacksService } from 'src/feedbacks/feedbacks.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: PaginateModel<User>,
    private readonly clsService: ClsService,
    private readonly feedBacksService: FeedbacksService,
  ) {}

  create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  findAll() {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return context;
  }

  async findOne(filter: any): Promise<UserDocument | null> {
    return this.userModel
      .findOne(filter)
      .populate({
        path: 'services',
        populate: {
          path: 'category',
          model: 'Category',
        },
      })
      .exec();
  }

  async findNearByWorkers(userId: string, serviceId?: string): Promise<any[]> {
    const customer = await this.userModel.findOne({ _id: userId }).exec();
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const radius = 10 / 6378.1;
    const query: any = {
      type: UserType.Worker,
      status: UserStatus.Verified,
      location: {
        $geoWithin: { $centerSphere: [customer.location.coordinates, radius] },
      },
    };

    if (serviceId) {
      query.services = serviceId;
    }

    let workers = await this.userModel
      .find(query)
      .populate({
        path: 'services',
        match: serviceId ? { _id: serviceId } : {},
        populate: {
          path: 'category',
          model: 'Category',
        },
      })
      .exec();

    if (workers.length === 0) {
      throw new HttpException('No Nearby Workers', HttpStatus.BAD_REQUEST);
    }

    // Optionally filter out workers without any services after population
    if (serviceId) {
      workers = workers.filter(
        (worker) =>
          Array.isArray(worker.services) &&
          worker.services.some(
            (service) => service._id.toString() === serviceId,
          ),
      );
    }

    // Fetch feedback summary for each worker and add it to their data
    const workersWithFeedbackSummary = await Promise.all(
      workers.map(async (worker) => {
        const feedbackSummary =
          await this.feedBacksService.findAvgRatingByWorker(
            worker._id.toString(),
          );
        return {
          ...worker.toObject(),
          feedbackSummary,
        };
      }),
    );

    return workersWithFeedbackSummary;
  }

  async findAllWorkersForService(serviceId: string): Promise<any[]> {
    const workers = await this.userModel
      .find({
        services: serviceId,
        type: UserType.Worker,
        status: UserStatus.Verified,
      })
      .populate({
        path: 'services',
        match: { _id: serviceId },
        populate: {
          path: 'category',
          model: 'Category',
        },
      })
      .exec();

    if (workers.length === 0) {
      throw new HttpException(
        'No Workers Found for the Specified Service',
        HttpStatus.NOT_FOUND,
      );
    }

    // Fetch feedback summary for each worker and add it to their data
    const workersWithFeedbackSummary = await Promise.all(
      workers.map(async (worker) => {
        const feedbackSummary =
          await this.feedBacksService.findAvgRatingByWorker(
            worker._id.toString(),
          );
        return {
          ...worker.toObject(),
          feedbackSummary,
        };
      }),
    );

    return workersWithFeedbackSummary;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return updatedUser;
  }

  async remove(id: string): Promise<{ deleted: boolean; id: string }> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { deleted: true, id };
  }

  async updateWorkerPaypalEmail(
    workerId: string,
    paypalEmail: string,
  ): Promise<UserDocument> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        workerId,
        { paypalEmail: paypalEmail, status: UserStatus.Verified },
        { new: true },
      )
      .exec();

    if (!updatedUser) {
      throw new HttpException('Worker not found', HttpStatus.NOT_FOUND);
    }

    return updatedUser;
  }
}
