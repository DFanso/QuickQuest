import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEnum,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { User } from '../../user/entities/user.entity';
import { Service } from '../../services/entities/service.entity';
import { JobStatus } from 'src/Types/jobs.types';

export class CreateJobDto {
  @ApiProperty({
    description: 'Service ID',
    example: '647d9a6d7c9d44b9c6d9a6d7',
  })
  @IsNotEmpty()
  service: Service;

  @IsNotEmpty()
  customer: User;

  @IsNotEmpty()
  labor: User;

  @IsOptional()
  @IsString()
  paypalPaymentId?: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ type: Date })
  @IsNotEmpty()
  @IsDateString()
  orderedDate: Date;

  @ApiProperty({ type: Date })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiProperty({ enum: JobStatus })
  @IsNotEmpty()
  @IsEnum(JobStatus)
  jobStatus: JobStatus;
}
