import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Service } from 'src/services/entities/service.entity';
import * as mongoose from 'mongoose';

export type BidDocument = Bid & Document;

@Schema({ timestamps: true })
export class Bid {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  customer: string;

  @ApiProperty({ description: 'Service', type: Service })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  })
  @IsNotEmpty()
  service: Service;

  @ApiProperty({ description: 'Bid price', example: 100.5 })
  @Prop({ required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;
}

export const BidSchema = SchemaFactory.createForClass(Bid);
