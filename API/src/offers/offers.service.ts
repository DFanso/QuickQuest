import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer, OfferDocument } from './entities/offer.entity';
import { OfferStatus } from 'src/Types/offer.types';

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(Offer.name) private offerModel: Model<OfferDocument>,
  ) {}

  async create(createOfferDto: CreateOfferDto): Promise<Offer> {
    const createdOffer = new this.offerModel(createOfferDto);
    return createdOffer.save();
  }

  async findAll(): Promise<Offer[]> {
    return this.offerModel.find().exec();
  }

  async findOne(filter: any): Promise<Offer> {
    return this.offerModel
      .findOne(filter)
      .populate('worker')
      .populate('service')
      .exec();
  }

  async update(id: string, updateOfferDto: UpdateOfferDto): Promise<Offer> {
    return this.offerModel
      .findByIdAndUpdate(id, updateOfferDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<{ deleted: boolean; id: string }> {
    const result = await this.offerModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);
    }
    return { deleted: true, id };
  }

  async updateExpiredOffers(): Promise<void> {
    const currentDate = new Date();
    const expiredOffers = await this.offerModel.find({
      expireDate: { $lte: currentDate },
      status: { $ne: OfferStatus.Expired },
    });

    for (const offer of expiredOffers) {
      offer.status = OfferStatus.Expired;
      await offer.save();
    }
  }
}
