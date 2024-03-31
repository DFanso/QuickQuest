import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { Job } from 'src/jobs/entities/job.entity';
import { User } from 'src/user/entities/user.entity';
import { Service } from 'src/services/entities/service.entity';

@Schema({ timestamps: true })
export class Feedback {
  @ApiProperty({ description: 'Reference to the Job the feedback is about' })
  @IsNotEmpty()
  @Prop({ type: Types.ObjectId, ref: 'Job', required: true })
  job: Job;

  @ApiProperty({ description: 'Reference to the customer' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  customer: User;

  @ApiProperty({ description: 'Reference to the worker' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  worker: User;

  @ApiProperty({ description: 'Reference to the service' })
  @Prop({ type: Types.ObjectId, ref: 'Service', required: false })
  service: Service;

  @ApiProperty({
    example: 'This is a feedback description.',
    description: 'Feedback Description',
  })
  @IsNotEmpty()
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    example: 5,
    description: 'Star rating',
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  @Prop({ required: true })
  stars: number;
}

export type FeedbackDocument = Feedback & Document;

const FeedbackSchema = SchemaFactory.createForClass(Feedback);

export { FeedbackSchema };
