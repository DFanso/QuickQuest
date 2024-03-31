import { forwardRef, Module } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { PaypalController } from './paypal.controller';
import { HttpModule } from '@nestjs/axios';
import { JobsModule } from 'src/jobs/jobs.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [HttpModule, forwardRef(() => JobsModule), EmailModule],
  controllers: [PaypalController],
  providers: [PaypalService],
  exports: [PaypalService],
})
export class PaypalModule {}