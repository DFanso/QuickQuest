import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUrl,
  IsOptional,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserType, UserStatus } from '../../Types/user.types';
import { Types } from 'mongoose';

class LocationDto {
  @ApiProperty({ example: 'Point', description: 'Type of the GeoJSON object' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    example: [-73.856077, 40.848447],
    description: 'Coordinates [longitude, latitude]',
  })
  @IsArray()
  @ArrayMinSize(2)
  @IsNotEmpty({ each: true })
  coordinates: number[];
}

export class CreateUserDto {
  userId: string;

  @ApiProperty({ example: 'John', description: 'First Name' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last Name' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password@123',
    description: 'Password',
    writeOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'A detailed about me section.',
    description: 'About Me',
    required: false,
  })
  @IsString()
  @IsOptional()
  aboutMe?: string;

  @ApiProperty({
    type: [Types.ObjectId],
    description: 'Array of service IDs',
    required: false,
    example: ['5fcbdd2015d7be0b9a63f676', '5fcbdd2015d7be0b9a63f677'],
  })
  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  services?: string;

  @ApiProperty({ enum: UserType, description: 'User Type' })
  @IsEnum(UserType)
  type: UserType;

  @ApiProperty({
    enum: UserStatus,
    description: 'User Status',
    default: UserStatus.Unverified,
  })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @ApiProperty({
    type: LocationDto,
    description: 'Location (Geospatial data for long, lat)',
  })
  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;

  @ApiProperty({
    example: 'http://example.com/profile.jpg',
    description: 'Profile Image URL',
  })
  @IsUrl()
  @IsOptional()
  profileImage?: string;
}
