import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OffersService } from './offers.service';

@Injectable()
export class OfferExpirationTask {
  private readonly logger = new Logger(OfferExpirationTask.name);

  constructor(private readonly offersService: OffersService) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleExpiredOffers() {
    try {
      await this.offersService.updateExpiredOffers();
      this.logger.log('Expired offers updated successfully');
    } catch (error) {
      this.logger.error('Failed to update expired offers:', error);
    }
  }
}
