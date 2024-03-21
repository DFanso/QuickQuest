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
  UnauthorizedException,
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { AppClsStore, UserType } from 'src/Types/user.types';
import { Bid } from './entities/bid.entity';
import { UserService } from 'src/user/user.service';
import { ServicesService } from 'src/services/services.service';

@ApiTags('bids')
@Controller({ path: 'bids', version: '1' })
export class BidsController {
  constructor(
    private readonly bidsService: BidsService,
    private readonly clsService: ClsService,
    private readonly userService: UserService,
    private readonly serviceService: ServicesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bid' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createBidDto: CreateBidDto) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.findOne({ _id: context.user.id });
    if (!user || user.type != UserType.Customer) {
      throw new HttpException('Unauthorized User', HttpStatus.UNAUTHORIZED);
    }
    createBidDto.customer = user._id;
    const service = await this.serviceService.findOne({
      _id: createBidDto.service,
    });
    if (!service) {
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    }
    if (createBidDto.budget <= service.startingPrice) {
      throw new HttpException(
        'Budget too low for the service starting price',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.bidsService.create(createBidDto);
  }

  @Get('matching')
  @ApiOperation({ summary: 'Get matching bids for the worker' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async findMatchingBids(): Promise<Bid[]> {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new UnauthorizedException('Unauthorized User');
    }
    const userId = context.user.id;
    return this.bidsService.findMatchingBids(userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bids with pagination' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ bids: Bid[]; totalPages: number }> {
    return this.bidsService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a bid by ID' })
  findOne(@Param('id') id: string) {
    return this.bidsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a bid' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateBidDto: UpdateBidDto) {
    return this.bidsService.update(id, updateBidDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bid' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.bidsService.remove(id);
  }
}
