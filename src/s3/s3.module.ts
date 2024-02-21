import { Logger, Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';

@Module({
  controllers: [S3Controller],
  providers: [S3Service, Logger],
  exports: [S3Service],
})
export class S3Module {}
