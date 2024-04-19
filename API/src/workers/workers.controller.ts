import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Query,
  Patch,
  Body,
} from '@nestjs/common';
import { WorkersService } from './workers.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from 'src/Types/user.types';
import { UserService } from 'src/user/user.service';
import { AddServicesDto } from './dto/AddServices.dto';

@ApiTags('workers')
@Controller({ path: 'workers', version: '1' })
export class WorkersController {
  constructor(
    private readonly workersService: WorkersService,
    private readonly clsService: ClsService,
    private readonly userService: UserService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/nearby')
  @ApiOperation({ summary: 'Find nearby workers' })
  @ApiQuery({
    name: 'serviceId',
    required: false,
    type: String,
    description: 'Optional service ID to filter workers',
  })
  async findNearBy(@Query('serviceId') serviceId?: string) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return this.workersService.findNearBy(context.user.id, serviceId);
  }
  @Get(':workerId/profile')
  @ApiOperation({ summary: 'Get worker profile with average rating' })
  async findWorkerProfileWithRating(@Param('workerId') workerId: string) {
    return this.workersService.workerProfile(workerId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('/services')
  @ApiOperation({ summary: 'Add services to worker' })
  @ApiBody({ type: AddServicesDto })
  @ApiResponse({
    status: 200,
    description: 'Services added successfully',
  })
  @ApiResponse({ status: 400, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async addServicesToWorker(@Body() addServicesDto: AddServicesDto) {
    const { serviceIds } = addServicesDto;
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const addedServices = await this.userService.addServicesToWorker(
      context.user.id,
      serviceIds,
    );
    return { message: 'Services added successfully', addedServices };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Remove a service from a worker' })
  @ApiResponse({ status: 200, description: 'Service removed successfully' })
  @ApiResponse({
    status: 400,
    description: 'User not found or Service not found',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Delete('/services/:serviceId')
  async removeServiceFromWorker(
    @Param('serviceId') serviceId: string,
  ): Promise<{ message: string }> {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const removedService = await this.userService.removeServiceFromWorker(
      context.user.id,
      serviceId,
    );

    if (!removedService) {
      throw new HttpException(
        'Failed to remove service',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { message: 'Service removed successfully' };
  }

  @Get()
  findAll() {
    return this.workersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workersService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workersService.remove(+id);
  }
}
