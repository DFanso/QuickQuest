import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OffersService } from './offers.service';

@Injectable()
export class OfferExpirationTask {
  private readonly logger = new Logger(OfferExpirationTask.name);

  constructor(private readonly offerService: OffersService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleExpiredOffers() {
    this.logger.log('Checking for expired offers...');
    try {
      await this.offerService.updateExpiredOffers();
      this.logger.log('Expired offers updated successfully');
    } catch (error) {
      this.logger.error('Failed to update expired offers:', error);
    }
  }
}
