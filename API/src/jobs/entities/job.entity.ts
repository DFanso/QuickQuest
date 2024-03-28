import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEnum,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';
import mongoose from 'mongoose';
import { User } from '../../user/entities/user.entity';
import { Service } from '../../services/entities/service.entity';
import { JobStatus } from 'src/Types/jobs.types';

export type JobDocument = Job & Document;

@Schema({ timestamps: true })
export class Job {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  })
  @IsNotEmpty()
  service: Service;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  @IsNotEmpty()
  customer: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  @IsNotEmpty()
  worker: User;

  @ApiProperty({ type: String })
  @Prop({ required: false })
  @IsOptional()
  @IsString()
  paypalPaymentId?: string;

  @ApiProperty({ type: String })
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ type: Number })
  @Prop({ required: true })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ type: Date })
  @Prop({ required: true })
  @IsNotEmpty()
  @IsDateString()
  orderedDate: Date;

  @ApiProperty({ type: Date })
  @Prop({ required: false })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiProperty({ enum: JobStatus })
  @Prop({ required: true, enum: JobStatus })
  @IsNotEmpty()
  @IsEnum(JobStatus)
  jobStatus: JobStatus;

  @Prop({ required: false })
  paymentUrl: string;
}

export const JobSchema = SchemaFactory.createForClass(Job);
