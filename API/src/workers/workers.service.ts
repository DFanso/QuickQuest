import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class WorkersService {
  constructor(private readonly userService: UserService) {}

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

  remove(id: number) {
    return `This action removes a #${id} worker`;
  }
}
