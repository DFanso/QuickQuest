import { forwardRef, Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Job, JobSchema } from './entities/job.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { PaypalModule } from 'src/paypal/paypal.module';
import { ClsModule } from 'nestjs-cls';
import { UserModule } from 'src/user/user.module';
import { EmailModule } from 'src/email/email.module';
import { ScheduleModule } from '@nestjs/schedule';
import { jobsNearingDelivery } from './job-delivery.task';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
    forwardRef(() => PaypalModule),
    ClsModule,
    forwardRef(() => UserModule),
    EmailModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [JobsController],
  providers: [JobsService, jobsNearingDelivery],
  exports: [JobsService],
})
export class JobsModule {}
