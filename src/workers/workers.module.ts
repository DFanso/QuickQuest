import { Module } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { WorkersController } from './workers.controller';
import { ClsModule } from 'nestjs-cls';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ClsModule, UserModule],
  controllers: [WorkersController],
  providers: [WorkersService],
  exports: [WorkersService],
})
export class WorkersModule {}
