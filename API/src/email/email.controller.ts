import { Controller } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('email')
@Controller({ path: 'email', version: '1' })
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
}
