import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  HttpException,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { AppClsStore, UserType } from 'src/Types/user.types';
import { UserService } from 'src/user/user.service';
import { JobStatus } from 'src/Types/jobs.types';

@ApiTags('jobs')
@Controller({ path: 'jobs', version: '1' })
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly clsService: ClsService,
    private readonly userService: UserService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('cancel/:id')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiParam({ name: 'id', description: 'The ID of the order to cancel' })
  async cancel(@Param('id') id: string) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.findOne({ _id: context.user.id });
    if (!user || user.type != UserType.Customer) {
      throw new HttpException('Unauthorized User', HttpStatus.UNAUTHORIZED);
    }
    await this.jobsService.cancelOrder(id);
    return { message: 'Job marked as Cancelled' };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('complete/:id')
  @ApiOperation({ summary: 'Mark a job as complete' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the job to mark as complete',
  })
  async completeJob(@Param('id') id: string) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.findOne({ _id: context.user.id });
    if (!user || user.type !== UserType.Customer) {
      throw new HttpException('Unauthorized User', HttpStatus.UNAUTHORIZED);
    }

    try {
      await this.jobsService.completeJob(id);
      return { message: 'Job marked as complete' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'An error occurred while marking the job as complete',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Get('/admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all jobs for Admin' })
  @UseGuards(AuthGuard('jwt'))
  async findAllAdmin() {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.findOne({ _id: context.user.id });
    if (!user || user.type !== UserType.Admin) {
      throw new HttpException('Unauthorized User', HttpStatus.UNAUTHORIZED);
    }

    return this.jobsService.findAllAdmin();
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all jobs' })
  @ApiQuery({ name: 'status', required: false, enum: JobStatus })
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Query('status') status?: JobStatus) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.findOne({ _id: context.user.id });
    if (!user) {
      throw new HttpException('Unauthorized User', HttpStatus.UNAUTHORIZED);
    }

    return this.jobsService.findAll(status, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.findOne({ _id: context.user.id });
    if (!user || user.type !== UserType.Admin) {
      throw new HttpException('Unauthorized User', HttpStatus.UNAUTHORIZED);
    }
    return this.jobsService.remove(id);
  }
}
