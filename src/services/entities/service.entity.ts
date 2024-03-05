import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { Category } from 'src/categories/entities/category.entity';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true })
export class Service {
  @ApiProperty({
    example: 'Service Name',
    description: 'The name of the service',
  })
  @IsNotEmpty()
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    example: 'Service Description',
    description: 'A brief description of the service',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Prop()
  description?: string;

  @ApiProperty({
    example: 'CategoryID',
    description: 'The ID of the category the service belongs to',
  })
  @IsMongoId()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  categoryID: Category | mongoose.Schema.Types.ObjectId;

  @ApiProperty({
    example: 100,
    description: 'The starting price of the service',
  })
  @IsNumber()
  @Min(0)
  @Prop({ required: true })
  startingPrice: number;

  @ApiProperty({
    example: 'http://example.com/service-image.jpg',
    description: 'The URL of the image related to the service',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  @Prop()
  imageUrl?: string;
}

const ServiceSchema = SchemaFactory.createForClass(Service);

// Apply the mongoose paginate plugin
ServiceSchema.plugin(mongoosePaginate);

export { ServiceSchema };
