import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ClsService } from 'nestjs-cls';
import { AppClsStore, UserStatus } from '../Types/user.types';

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
}
