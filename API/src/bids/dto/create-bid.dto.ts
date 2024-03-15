import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  IsMongoId,
} from 'class-validator';

export class CreateBidDto {
  @IsNotEmpty()
  @IsString()
  customer: string;

  @ApiProperty({
    description: 'Service ID',
    example: '647d9a6d7c9d44b9c6d9a6d7',
  })
  @IsNotEmpty()
  @IsMongoId()
  service: string;

  @ApiProperty({ description: 'Bid price', example: 100.5 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;
}
