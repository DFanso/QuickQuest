import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  Min,
  IsString,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { OfferStatus } from 'src/Types/offer.types';

export class CreateOfferDto {
  @ApiProperty({
    description: 'Service ID',
    example: '647d9a6d7c9d44b9c6d9a6d7',
  })
  @IsNotEmpty()
  @IsString()
  service: string;

  worker: string;

  @ApiProperty({ description: 'Price', example: 1000 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Offer description',
    example: 'This is an offer description',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Start date',
    example: '2023-06-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @ApiProperty({ description: 'End date', example: '2023-06-30T23:59:59.999Z' })
  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @ApiProperty({
    description: 'Offer status',
    example: OfferStatus.Pending,
    enum: OfferStatus,
  })
  @IsNotEmpty()
  @IsEnum(OfferStatus)
  status: OfferStatus;

  @ApiProperty({
    description: 'Expiration date',
    example: '2023-07-31T23:59:59.999Z',
  })
  @IsNotEmpty()
  @IsDateString()
  expireDate: Date;
}
