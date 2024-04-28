import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmForgotPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user confirming their new password',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: '123456',
    description: "The verification code sent to the user's email",
  })
  @IsNotEmpty()
  @IsString()
  confirmationCode: string;

  @ApiProperty({
    example: 'newPassword123!',
    description: 'The new password for the user',
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
