import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { UserService } from 'src/user/user.service';
import { AppClsStore, UserType } from 'src/Types/user.types';
import { JobsService } from 'src/jobs/jobs.service';
import { JobStatus } from 'src/Types/jobs.types';

@ApiTags('feedback')
@Controller({ path: 'feedback', version: '1' })
export class FeedbacksController {
  constructor(
    private readonly feedbackService: FeedbacksService,
    private readonly clsService: ClsService,
    private readonly userService: UserService,
    private readonly jobService: JobsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create feedback' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async create(@Body() createFeedbackDto: CreateFeedbackDto) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.findOne({ _id: context.user.id });
    if (!user || user.type != UserType.Customer) {
      throw new HttpException('Unauthorized User', HttpStatus.UNAUTHORIZED);
    }
    const job = await this.jobService.findOne(createFeedbackDto.job);
    if (!job || job.customer.email !== user.email) {
      throw new HttpException('Unauthorized User', HttpStatus.UNAUTHORIZED);
    }
    if (job.status !== JobStatus.Completed) {
      throw new HttpException('Job not Completed', HttpStatus.UNAUTHORIZED);
    }
    return this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all feedback' })
  findAll() {
    return this.feedbackService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get feedback by ID' })
  findOne(@Param('id') id: string) {
    return this.feedbackService.findOne(id);
  }
}
