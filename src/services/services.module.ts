import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { ClsModule } from 'nestjs-cls';
import { Service, ServiceSchema } from './entities/service.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }]),
    ClsModule,
    UserModule,
    CategoriesModule,
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
