import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { AppClsStore, UserStatus, UserType } from 'src/Types/user.types';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly clsService: ClsService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  profile() {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return this.userService.findOne({ _id: context.user.id });
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

  decodeJwtToken(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );

    return JSON.parse(jsonPayload);
  }
}
