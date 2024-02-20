import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsUrl, IsOptional, ValidateNested, IsArray, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { UserType, UserStatus } from '../../Types/user.types';

class LocationDto {
  @ApiProperty({ example: 'Point', description: 'Type of the GeoJSON object' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ example: [-73.856077, 40.848447], description: 'Coordinates [longitude, latitude]' })
  @IsArray()
  @ArrayMinSize(2)
  @IsNotEmpty({ each: true })
  coordinates: number[];
}

export class CreateUserDto {
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

  @ApiProperty({ example: 'Password@123', description: 'Password', writeOnly: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: UserType, description: 'User Type' })
  @IsEnum(UserType)
  type: UserType;

  @ApiProperty({ enum: UserStatus, description: 'User Status', default: UserStatus.Unverified })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @ApiProperty({ type: LocationDto, description: 'Location (Geospatial data for long, lat)' })
  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;

  @ApiProperty({ example: 'http://example.com/profile.jpg', description: 'Profile Image URL' })
  @IsUrl()
  @IsOptional()
  profileImage?: string;
}
