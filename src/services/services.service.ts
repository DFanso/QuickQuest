import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service, ServiceDocument } from './entities/service.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name)
    private serviceModel: PaginateModel<ServiceDocument>,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<ServiceDocument> {
    const createdService = new this.serviceModel(createServiceDto);
    return createdService.save();
  }

  async findAll(): Promise<ServiceDocument[]> {
    return this.serviceModel.find().exec();
  }

  async findOne(filter: any): Promise<Service | null> {
    const service = await this.serviceModel
      .findOne(
        filter,
        Object.keys(this.serviceModel.schema.obj)
          .map((key) => key)
          .join(' '),
      )
      .populate('category')
      .exec();

    if (!service) {
      throw new NotFoundException(`Service not found`);
    }

    return service;
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceDocument> {
    const updatedService = await this.serviceModel
      .findByIdAndUpdate(id, updateServiceDto, { new: true })
      .exec();
    if (!updatedService) {
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    }
    return updatedService;
  }

  async remove(id: string): Promise<{ deleted: boolean; id: string }> {
    const result = await this.serviceModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    }
    return { deleted: true, id };
  }
}
