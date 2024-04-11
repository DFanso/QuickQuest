import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from 'src/user/user.module';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [HttpModule, UserModule, ClsModule],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}
