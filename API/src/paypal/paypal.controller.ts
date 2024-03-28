/* eslint-disable no-console */
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { JobsService } from '../jobs/jobs.service';
import { EmailService } from 'src/email/email.service';

@ApiTags('paypal')
@Controller({ path: 'paypal', version: '1' })
export class PaypalController {
  constructor(
    private readonly paypalService: PaypalService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly jobService: JobsService,
    private readonly emailService: EmailService,
  ) {}

  @Post('/webhook')
  async handleWebhook(@Body() body: any, @Res() res: Response) {
    console.log('Received PayPal webhook:', body);

    const jobId = body.resource.purchase_units[0].custom_id;
    console.log(jobId);

    if (body.event_type === 'CHECKOUT.ORDER.APPROVED') {
      try {
        await this.jobService.updateJobStatus(jobId);

        console.log(`Job status updated for jobId: ${jobId}`);

        const job = await this.jobService.findOne(jobId);

        // Render email content with job and worker details
        const emailContent = await this.emailService.renderTemplate(
          'payment-confirmation.hbs',
          {
            jobID: jobId,
            serviceName: job.service.name,
            description: job.service.description,
            price: job.price,
            orderedDate: job.orderedDate.toISOString(),
            workerName: job.worker.firstName + ' ' + job.worker.lastName,
            workerContact: job.worker.email, // Assuming you want to include worker's email
          },
        );

        // Send email
        await this.emailService.sendEmail(
          [job.customer.email],
          'Payment Confirmation',
          emailContent,
        );
      } catch (error) {
        console.error('Error updating job status:', error);
      }

      return res.status(HttpStatus.OK).send('Webhook received');
    }

    return res.status(HttpStatus.BAD_REQUEST).send('Invalid event type');
  }
}
