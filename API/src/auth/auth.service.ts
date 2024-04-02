import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { AppClsStore, UserStatus, UserType } from 'src/Types/user.types';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly clsService: ClsService,
    private userService: UserService,
  ) {}

  profile() {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return this.userService.findOne({ userId: context.user.id });
  }

  create(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  async verify(email: string) {
    const user = await this.userService.findOne({ email: email });
    if (!user) {
      throw new HttpException('Email is not registered', HttpStatus.NOT_FOUND);
    }
    if (user.type == UserType.Worker) {
      user.status = UserStatus.PaypalAuth;
    } else {
      user.status = UserStatus.Verified;
    }
    user.save();
  }
}
