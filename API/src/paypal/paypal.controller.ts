/* eslint-disable no-console */
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { JobsService } from '../jobs/jobs.service';
import { EmailService } from 'src/email/email.service';
import { AuthGuard } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { AppClsStore, UserType } from 'src/Types/user.types';
import { UserService } from 'src/user/user.service';

@ApiTags('paypal')
@Controller({ path: 'paypal', version: '1' })
export class PaypalController {
  constructor(
    private readonly paypalService: PaypalService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly jobService: JobsService,
    private readonly emailService: EmailService,
    private readonly clsService: ClsService,
    private readonly userService: UserService,
  ) {}

  @Post('/webhook')
  async handleWebhook(@Body() body: any, @Res() res: Response) {
    console.log('Received PayPal webhook:', body);

    const jobId = body.resource.purchase_units[0].custom_id;
    console.log(jobId);

    const orderId = body.resource.id;

    if (body.event_type === 'CHECKOUT.ORDER.APPROVED') {
      try {
        await this.jobService.updateJobStatus(jobId, orderId);
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
      await this.paypalService.completeOrder(orderId);
      return res.status(HttpStatus.OK).send('Webhook received');
    }
    return res.status(HttpStatus.BAD_REQUEST).send('Invalid event type');
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/auth')
  async authorize(@Res() res: Response) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.findOne({ _id: context.user.id });
    if (!user || user.type != UserType.Worker) {
      throw new HttpException('Unauthorized User', HttpStatus.UNAUTHORIZED);
    }
    const authorizationUrl = await this.paypalService.getAuthorizationUrl(
      context.user.id,
    );
    res.send(authorizationUrl);
  }

  @Get('/callback')
  async callback(
    @Query('code') authorizationCode: string,
    @Query('state') workerId: string,
    @Res() res: Response,
  ) {
    try {
      const accessToken =
        await this.paypalService.getAccessToken(authorizationCode);
      const paypalEmail = await this.paypalService.getPaypalEmail(accessToken);
      console.log(paypalEmail, ' ', workerId);
      await this.paypalService.updateWorkerPaypalEmail(workerId, paypalEmail);
      const frontendUrl = 'https://worker-quick-quest.vercel.app/login';
      res.redirect(frontendUrl);
      return { success: true, message: 'PayPal email updated successfully' };
    } catch (error) {
      console.error('Error updating PayPal email:', error);
      console.error('Authorization Code:', authorizationCode);
      const frontendUrl = 'https://worker-quick-quest.vercel.app/login';
      res.redirect(frontendUrl);
      return {
        success: false,
        message: 'Error updating PayPal email',
        error: error.message,
      };
    }
  }
}
