import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContentType } from 'src/Types/chat.types';
import { User } from 'src/user/entities/user.entity';
import { Schema as MongooseSchema } from 'mongoose';

class MessageDTO {
  @ApiProperty({ type: User })
  @IsMongoId()
  @IsNotEmpty()
  sender: User;

  @ApiProperty({ enum: ContentType })
  @IsEnum(ContentType)
  @IsNotEmpty()
  contentType: ContentType;

  @ApiProperty()
  @IsNotEmpty()
  content: string | MongooseSchema.Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  timestamp: Date;
}

export class CreateChatDto {
  @ApiProperty({ type: User })
  @IsMongoId()
  @IsNotEmpty()
  customer: User;

  @ApiProperty({ type: User })
  @IsMongoId()
  @IsNotEmpty()
  worker: User;

  @ApiProperty({ type: [MessageDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDTO)
  messages: MessageDTO[];
}
