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

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: PaginateModel<User>,
    private readonly clsService: ClsService,
  ) {}

  create(createUserDto: CreateUserDto) {
    createUserDto.status = UserStatus.Unverified;
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  createSSo(createUserDto: CreateUserDto) {
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

  async findNearByWorkers(userId: string, serviceId?: string): Promise<User[]> {
    const customer = await this.userModel.findOne({ userId }).exec();
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const radius = 10 / 6378.1;

    // eslint-disable-next-line prefer-const
    let query: any = {
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

    return workers;
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
      .findByIdAndUpdate(workerId, { paypalEmail: paypalEmail }, { new: true })
      .exec();

    if (!updatedUser) {
      throw new HttpException('Worker not found', HttpStatus.NOT_FOUND);
    }

    return updatedUser;
  }
}
