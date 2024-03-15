import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { Bid, BidDocument } from './entities/bid.entity';

@Injectable()
export class BidsService {
  constructor(@InjectModel(Bid.name) private bidModel: Model<BidDocument>) {}

  async create(createBidDto: CreateBidDto): Promise<Bid> {
    const createdBid = new this.bidModel(createBidDto);
    return createdBid.save();
  }

  findAll(): Promise<Bid[]> {
    return this.bidModel.find().exec();
  }

  async findOne(id: string): Promise<Bid> {
    return this.bidModel
      .findById(id)
      .populate({
        path: 'customer',
        model: 'User', // Specify the referenced model for the user field
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
