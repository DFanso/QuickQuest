import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, IsEnum } from 'class-validator';
import { BucketDomains } from 'src/Types/s3.types';

export class GeneratePresignedUrlDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[^\\/:\*\?"<>\|]+$/, {
    message: 'Invalid characters in file name.',
  })
  @ApiProperty({
    description: 'Name of the file',
    type: String,
    default: 'test.jpeg',
  })
  readonly fileName: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(BucketDomains)
  @ApiProperty({
    description: 'Domain of the file',
    type: String,
    enum: BucketDomains,
    enumName: 'BucketDomains',
  })
  readonly domain: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Content type of the file',
    type: String,
    default: 'image/jpeg',
  })
  readonly contentType: string;
}

export class GeneratePresignedUrlResponseDto {
  @ApiProperty({
    description: 'The generated presigned url.',
    example: 'https://put-object.-bucket-name-here.s3.amazonaws.com/...',
    type: String,
  })
  presignedUrl: string;

  @ApiProperty({
    description: 'The generated s3 object url.',
    example: 'https://bucket-name-here.s3.amazonaws.com/...',
    type: String,
  })
  s3url: string;
}
