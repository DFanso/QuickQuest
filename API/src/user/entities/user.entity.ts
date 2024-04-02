import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { UserType, UserStatus } from '../../Types/user.types';
import { Service } from 'src/services/entities/service.entity';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  userId: string;

  @ApiProperty({ example: 'John', description: 'First Name' })
  @IsNotEmpty()
  @Prop({ required: true })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last Name' })
  @IsNotEmpty()
  @Prop({ required: true })
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email' })
  @IsEmail()
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({
    example: 'A detailed about me section.',
    description: 'About Me',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Prop()
  aboutMe?: string;

  @ApiProperty({
    type: [String],
    description: 'Array of service IDs',
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }] })
  services?: Service[] | mongoose.Schema.Types.ObjectId[];

  @ApiProperty({ enum: UserType, description: 'User Type' })
  @IsEnum(UserType)
  @Prop({ type: String, enum: UserType, default: UserType.Customer })
  type: UserType;

  @ApiProperty({ enum: UserStatus, description: 'User Status' })
  @IsEnum(UserStatus)
  @Prop({ type: String, enum: UserStatus, default: UserStatus.Unverified })
  status: UserStatus;

  @ApiProperty({
    type: 'object',
    example: { type: 'Point', coordinates: [-73.856077, 40.848447] },
    description:
      'Location (Geospatial data using GeoJSON format for long, lat)',
  })
  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: {
    type: string;
    coordinates: number[];
  };

  @ApiProperty({
    example: 'http://example.com/profile.jpg',
    description: 'Profile Image URL',
  })
  @IsUrl()
  @Prop()
  profileImage: string;

  @Prop({ required: false })
  paypalEmail: string;
  _id: unknown;
}

const UserSchema = SchemaFactory.createForClass(User);

// Apply the mongoose paginate plugin
UserSchema.plugin(mongoosePaginate);

// Create a 2dsphere index for supporting geospatial queries efficiently
UserSchema.index({ location: '2dsphere' });

export { UserSchema };
