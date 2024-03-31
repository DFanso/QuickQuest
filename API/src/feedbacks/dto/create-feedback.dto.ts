import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({ description: 'ID of the Job the feedback is about' })
  @IsNotEmpty()
  @IsMongoId()
  job: string;

  @ApiProperty({ description: 'ID of the customer' })
  @IsNotEmpty()
  @IsMongoId()
  customer: string;

  @ApiProperty({ description: 'ID of the worker' })
  @IsNotEmpty()
  @IsMongoId()
  worker: string;

  @ApiProperty({ description: 'ID of the service' })
  @IsNotEmpty()
  @IsMongoId()
  service: string;

  @ApiProperty({
    example: 'This is a feedback description.',
    description: 'Feedback Description',
  })
  @IsNotEmpty()
  @IsString()
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
  stars: number;
}
