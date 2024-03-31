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
  @ApiProperty({
    description: 'ID of the Job the feedback is about',
    example: '647d9a6d7c9d44b9c6d9a6d7',
  })
  @IsNotEmpty()
  @IsMongoId()
  job: string;

  customer: string;

  worker: string;

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
