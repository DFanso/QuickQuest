/* eslint-disable no-console */
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@ApiTags('paypal')
@Controller({ path: 'paypal', version: '1' })
export class PaypalController {
  constructor(
    private readonly paypalService: PaypalService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/webhook/checkout')
  async handleWebhook(@Body() body: any, @Res() res: Response) {
    console.log('Received PayPal webhook:', body);
    const jobId = body.resource.purchase_units[0].custom_id;
    console.log(jobId);

    if (body.event_type === 'CHECKOUT.ORDER.APPROVED') {
      return res.status(HttpStatus.OK).send('Webhook received');
    }
  }
}
