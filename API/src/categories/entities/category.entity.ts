import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @ApiProperty({
    example: 'Electronics',
    description: 'The name of the category',
  })
  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    example: 'Devices and gadgets',
    description: 'Description of the category',
  })
  @IsOptional()
  @IsString()
  @Prop()
  description?: string;

  @ApiProperty({
    example: 'http://example.com/icon.jpg',
    description: 'URL of the category icon',
  })
  @IsUrl()
  @IsOptional()
  @Prop()
  iconUrl?: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
