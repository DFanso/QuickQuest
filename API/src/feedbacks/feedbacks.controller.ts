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

@ApiTags('feedback')
@Controller({ path: 'feedback', version: '1' })
export class FeedbacksController {
  constructor(private readonly feedbackService: FeedbacksService) {}

  @Post()
  @ApiOperation({ summary: 'Create feedback' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
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