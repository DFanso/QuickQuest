import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class WorkersService {
  constructor(private readonly userService: UserService) {}

  create(createWorkerDto: CreateWorkerDto) {
    return 'This action adds a new worker';
  }

  findNearBy(userId: string, serviceId?: string) {
    const workers = this.userService.findNearByWorkers(userId, serviceId);
    return workers;
  }

  findAll() {
    return `This action returns all workers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} worker`;
  }

  update(id: number, updateWorkerDto: UpdateWorkerDto) {
    return `This action updates a #${id} worker`;
  }

  remove(id: number) {
    return `This action removes a #${id} worker`;
  }
}
