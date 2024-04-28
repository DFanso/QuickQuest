import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ReRequestCodeDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user who wants to reset their password',
  })
  @IsNotEmpty()
  @IsString()
  email: string;
}
