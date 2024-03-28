import { forwardRef, Module } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { PaypalController } from './paypal.controller';
import { HttpModule } from '@nestjs/axios';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
  imports: [HttpModule, forwardRef(() => JobsModule)],
  controllers: [PaypalController],
  providers: [PaypalService],
  exports: [PaypalService],
})
export class PaypalModule {}
