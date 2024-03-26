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
  @ApiProperty({ type: Service })
  @IsNotEmpty()
  service: Service;

  @ApiProperty({ type: User })
  @IsNotEmpty()
  customer: User;

  @ApiProperty({ type: User })
  @IsNotEmpty()
  labor: User;

  @ApiProperty({ type: String })
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
