import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { Offer, OfferSchema } from './entities/offer.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesModule } from 'src/services/services.module';
import { ClsModule } from 'nestjs-cls';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Offer.name, schema: OfferSchema }]),
    ClsModule,
    UserModule,
    ServicesModule,
  ],
  controllers: [OffersController],
  providers: [OffersService],
  exports: [OffersService],
})
export class OffersModule {}
