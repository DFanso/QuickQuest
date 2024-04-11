import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { AppClsStore, UserType } from 'src/Types/user.types';
import { UserService } from 'src/user/user.service';
import { CategoriesService } from 'src/categories/categories.service';

@ApiTags('services')
@Controller({ path: 'services', version: '1' })
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly clsService: ClsService,
    private readonly userService: UserService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Create service' })
  async create(@Body() createServiceDto: CreateServiceDto) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.findOne({ _id: context.user.id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.type != UserType.Admin) {
      throw new HttpException('Unauthorized User', HttpStatus.UNAUTHORIZED);
    }
    const category = await this.categoriesService.findOne({
      _id: createServiceDto.category,
    });
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return this.servicesService.create(createServiceDto);
  }

  @Get(':serviceId/workers')
  @ApiOperation({
    summary: 'Get all workers for a specific service',
  })
  async findAllWorkersForService(@Param('serviceId') serviceId: string) {
    return this.userService.findAllWorkersForService(serviceId);
  }

  @Get()
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Optional category ID to filter services',
  })
  @ApiOperation({ summary: 'Get all services filtered by category' })
  findAll(@Query('category') category?: string) {
    return this.servicesService.findAll(category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service by ID' })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne({ _id: id });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({ summary: 'Update a service by ID' })
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.findOne({ userId: context.user.id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.type != UserType.Admin) {
      throw new HttpException('Unauthorized User', HttpStatus.UNAUTHORIZED);
    }
    return this.servicesService.update(id, updateServiceDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a service by ID' })
  async remove(@Param('id') id: string) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.findOne({ userId: context.user.id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.type != UserType.Admin) {
      throw new HttpException('Unauthorized User', HttpStatus.UNAUTHORIZED);
    }
    return this.servicesService.remove(id);
  }
}
