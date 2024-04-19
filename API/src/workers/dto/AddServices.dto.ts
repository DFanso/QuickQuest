import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class AddServicesDto {
  @ApiProperty({
    type: [Types.ObjectId],
    description: 'Array of service IDs',
    required: false,
    example: ['5fcbdd2015d7be0b9a63f676', '5fcbdd2015d7be0b9a63f677'],
  })
  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  serviceIds: string[];
}
