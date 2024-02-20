import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as bcrypt from 'bcrypt';
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { UserType, UserStatus } from '../../Types/user.types';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

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

  @Prop({ select: false })
  password: string;

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
    description: 'Location (Geospatial data using GeoJSON format for long, lat)',
  })
  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  })
  location: {
    type: string;
    coordinates: number[];
  };


  @ApiProperty({ example: 'http://example.com/profile.jpg', description: 'Profile Image URL' })
  @IsUrl()
  @Prop()
  profileImage: string;
}

const UserSchema = SchemaFactory.createForClass(User);

// Apply the mongoose paginate plugin
UserSchema.plugin(mongoosePaginate);

// Create a 2dsphere index for supporting geospatial queries efficiently
UserSchema.index({ 'location': '2dsphere' });

// Password hashing middleware
UserSchema.pre<UserDocument>('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

export { UserSchema };
