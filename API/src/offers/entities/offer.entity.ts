import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, IsString, IsEnum } from 'class-validator';
import mongoose from 'mongoose';
import { OfferStatus } from '../../Types/offer.types';
import { Service } from '../../services/entities/service.entity';
import { User } from '../../user/entities/user.entity';

export type OfferDocument = Offer & Document;

@Schema({ timestamps: true })
export class Offer {
  @ApiProperty({ description: 'Service', type: Service })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  })
  @IsNotEmpty()
  service: Service;

  @ApiProperty({ description: 'Labor', type: User })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  @IsNotEmpty()
  worker: User;

  @ApiProperty({ description: 'Price', example: 1000 })
  @Prop({ required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Offer description',
    example: 'This is an offer description',
  })
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'deliveryDate date',
    example: '2023-06-30T23:59:59.999Z',
  })
  @Prop({ required: true })
  @IsNotEmpty()
  deliveryDate: Date;

  @ApiProperty({
    description: 'Offer status',
    example: OfferStatus.Pending,
    enum: OfferStatus,
  })
  @Prop({ required: true, enum: OfferStatus, default: OfferStatus.Pending })
  @IsNotEmpty()
  @IsEnum(OfferStatus)
  status: OfferStatus;

  @ApiProperty({
    description: 'Expiration date',
    example: '2023-07-31T23:59:59.999Z',
  })
  @Prop({ required: true })
  @IsNotEmpty()
  expireDate: Date;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);

OfferSchema.pre<Offer>('save', function (next) {
  if (this.expireDate <= new Date()) {
    this.status = OfferStatus.Expired;
  }
  next();
});
