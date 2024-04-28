import { PartialType } from '@nestjs/swagger';
import { CreatePaypalDto } from './create-paypal.dto';

export class UpdatePaypalDto extends PartialType(CreatePaypalDto) {}
