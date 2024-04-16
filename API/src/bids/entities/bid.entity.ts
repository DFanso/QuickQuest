import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, IsString } from 'class-validator';
import { Service } from 'src/services/entities/service.entity';
import * as mongoose from 'mongoose';
import { User } from 'src/user/entities/user.entity';

export type BidDocument = Bid & Document;

@Schema({ timestamps: true })
export class Bid {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  customer: User;

  @ApiProperty({ description: 'Service', type: Service })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  })
  @IsNotEmpty()
  service: Service;

  @ApiProperty({ description: 'Bid budget', example: 1000 })
  @Prop({ required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  budget: number;

  @ApiProperty({
    description: 'Bid description',
    example: 'This is a bid description',
  })
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Bid expiration date',
    example: '2023-06-30T23:59:59.999Z',
  })
  @Prop({ required: true, index: { expires: 0 } })
  @IsNotEmpty()
  expireDate: Date;
}

export const BidSchema = SchemaFactory.createForClass(Bid);
