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
    const jobId = body.resource.purchase_units[0].custom_id; // Fixed the property access
    console.log(jobId);

    if (body.event_type === 'CHECKOUT.ORDER.APPROVED') {
      try {
        let captureId = null;
        if (
          body.resource.purchase_units[0].payments && // Added a check for the existence of payments property
          body.resource.purchase_units[0].payments.captures
        ) {
          captureId = body.resource.purchase_units[0].payments.captures[0].id;
        }
        await this.jobService.updateJobStatus(jobId, captureId);
        console.log(`Job status updated for jobId: ${jobId}`);

        const job = await this.jobService.findOne(jobId);

        // Render email content with job and worker details
        const emailContent = await this.emailService.renderTemplate(
          'payment-confirmation.hbs',
          {
            customerName: job.customer.firstName + ' ' + job.customer.lastName,
            jobID: jobId,
            serviceName: job.service.name,
            description: job.service.description,
            price: job.price,
            orderedDate: job.orderedDate.toISOString(),
            workerName: job.worker.firstName + ' ' + job.worker.lastName,
            workerContact: job.worker.email,
          },
        );

        const workerEmailContent = await this.emailService.renderTemplate(
          'worker-assignment.hbs',
          {
            workerName: job.worker.firstName + ' ' + job.worker.lastName,
            jobID: jobId,
            serviceName: job.service.name,
            description: job.service.description,
            price: job.price,
            orderedDate: job.orderedDate.toISOString(),
            customerName: job.customer.firstName + ' ' + job.customer.lastName,
            customerContact: job.customer.email,
            loginUrl: 'https://quickquest.com/login',
          },
        );

        // Send email
        await this.emailService.sendEmail(
          [job.customer.email],
          'Payment Confirmation',
          emailContent,
        );

        await this.emailService.sendEmail(
          [job.worker.email],
          'New Job Assignment',
          workerEmailContent,
        );
      } catch (error) {
        console.error('Error updating job status:', error);
      }
      return res.status(HttpStatus.OK).send('Webhook received');
    }
    return res.status(HttpStatus.BAD_REQUEST).send('Invalid event type');
  }
}
