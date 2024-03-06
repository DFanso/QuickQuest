import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    description: 'The name of the service',
    example: 'Web Development',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The description of the service',
    required: true,
    example:
      'Full stack web development services including front-end, back-end, and database development.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The ID of the category the service belongs to',
    example: '62fc5b8f6d0b8b96d9f3c5e9',
  })
  @IsMongoId()
  category: string;

  @ApiProperty({
    description: 'The starting price of the service',
    example: 500,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  startingPrice: number;

  @ApiProperty({
    description: 'The URL of the image related to the service',
    required: false,
    example: 'http://example.com/service-image.png',
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
