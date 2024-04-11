import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationDto } from './dto/recommendation.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClsService } from 'nestjs-cls';
import { UserService } from 'src/user/user.service';
import { AppClsStore, UserType } from 'src/Types/user.types';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('recommendations')
@Controller({ path: 'recommendations', version: '1' })
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
    private readonly clsService: ClsService,
    private readonly userService: UserService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(): Promise<RecommendationDto[]> {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.findOne({ _id: context.user.id });
    if (!user || user.type != UserType.Customer) {
      throw new HttpException('Unauthorized User', HttpStatus.UNAUTHORIZED);
    }
    return this.recommendationsService.findAll(context.user.id);
  }
}
