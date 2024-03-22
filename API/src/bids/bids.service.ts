/* eslint-disable no-console */
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { Bid, BidDocument } from './entities/bid.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BidsService {
  constructor(
    @InjectModel(Bid.name) private bidModel: Model<BidDocument>,
    private readonly userService: UserService,
  ) {}

  async create(createBidDto: CreateBidDto): Promise<Bid> {
    const createdBid = new this.bidModel(createBidDto);
    return createdBid.save();
  }

  async findMatchingBids(userId: string): Promise<Bid[]> {
    const worker = await this.userService.findOne({ _id: userId });
    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    const serviceIds = worker.services.map((service) => service.id);

    const bids = await this.bidModel
      .find({
        service: { $in: serviceIds },
      })
      .populate({
        path: 'customer',
        model: 'User',
      })
      .populate({
        path: 'service',
        populate: {
          path: 'category',
          model: 'Category',
        },
      })
      .exec();

    return bids;
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ bids: Bid[]; totalPages: number }> {
    const skip = (page - 1) * limit;

    const [bids, totalCount] = await Promise.all([
      this.bidModel
        .find()
        .populate({
          path: 'customer',
          model: 'User',
        })
        .populate('service')
        .skip(skip)
        .limit(limit)
        .exec(),
      this.bidModel.countDocuments().exec(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return { bids, totalPages };
  }
  async findOne(id: string): Promise<Bid> {
    return this.bidModel
      .findById(id)
      .populate({
        path: 'customer',
        model: 'User',
      })
      .populate('service')
      .exec();
  }

  async update(id: string, updateBidDto: UpdateBidDto): Promise<Bid> {
    const updatedBid = await this.bidModel
      .findByIdAndUpdate(id, updateBidDto, { new: true })
      .exec();

    if (!updatedBid) {
      throw new HttpException('Bid not found', HttpStatus.NOT_FOUND);
    }

    return updatedBid;
  }

  async remove(id: string): Promise<{ deleted: boolean; id: string }> {
    const result = await this.bidModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new HttpException('Bid not found', HttpStatus.NOT_FOUND);
    }

    return { deleted: true, id };
  }
}
