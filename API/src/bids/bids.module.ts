import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';

@Module({
  controllers: [BidsController],
  providers: [BidsService],
})
export class BidsModule {}
