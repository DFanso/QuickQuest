import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Electronics',
    description: 'The name of the category',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Devices and gadgets',
    description: 'A brief description of the category',
    required: true,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'http://example.com/icon.png',
    description: 'URL to the icon image for the category',
    required: true,
  })
  @IsOptional()
  @IsUrl()
  iconUrl?: string;
}
