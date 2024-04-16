import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  IsMongoId,
  IsDateString,
} from 'class-validator';

export class CreateBidDto {
  customer: string;

  @ApiProperty({
    description: 'Service ID',
    example: '647d9a6d7c9d44b9c6d9a6d7',
  })
  @IsNotEmpty()
  @IsMongoId()
  service: string;

  @ApiProperty({ description: 'Bid budget', example: 1000 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  budget: number;

  @ApiProperty({
    description: 'Bid description',
    example: 'This is a bid description',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Bid expiration date',
    example: '2023-06-30T23:59:59.999Z',
  })
  @IsNotEmpty()
  @IsDateString()
  expireDate: Date;
}
