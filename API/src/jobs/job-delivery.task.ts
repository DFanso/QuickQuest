import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JobsService } from './jobs.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class jobsNearingDelivery {
  private readonly logger = new Logger(jobsNearingDelivery.name);

  constructor(
    private readonly jobsService: JobsService,
    private readonly emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleJobDeliveryReminders() {
    const jobsNearingDelivery = await this.jobsService.getJobsNearingDelivery();

    for (const job of jobsNearingDelivery) {
      // Render the reminder email template
      const reminderEmailContent = await this.emailService.renderTemplate(
        'job-delivery-reminder.hbs',
        {
          workerName: job.worker.firstName + ' ' + job.worker.lastName,
          orderID: job._id,
          serviceName: job.service.name,
          description: job.service.description,
          deliveryDate: job.deliveryDate.toISOString(),
        },
      );

      // Send the reminder email to the worker
      await this.emailService.sendEmail(
        [job.worker.email],
        'Job Delivery Reminder',
        reminderEmailContent,
      );

      this.logger.log(`Sent job delivery reminder for job ${job._id}`);
    }
  }
}
