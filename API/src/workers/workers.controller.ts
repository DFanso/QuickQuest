import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { WorkersService } from './workers.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from 'src/Types/user.types';

@ApiTags('workers')
@Controller({ path: 'workers', version: '1' })
export class WorkersController {
  constructor(
    private readonly workersService: WorkersService,
    private readonly clsService: ClsService,
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
