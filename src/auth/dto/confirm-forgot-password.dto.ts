import { ApiProperty } from '@nestjs/swagger';

export class ConfirmForgotPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user confirming their new password',
  })
  email: string;

  @ApiProperty({
    example: '123456',
    description: "The verification code sent to the user's email",
  })
  confirmationCode: string;

  @ApiProperty({
    example: 'newPassword123!',
    description: 'The new password for the user',
  })
  newPassword: string;
}
