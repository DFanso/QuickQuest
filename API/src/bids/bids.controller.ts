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
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from 'src/Types/user.types';

@ApiTags('bids')
@Controller({ path: 'bids', version: '1' })
export class BidsController {
  constructor(
    private readonly bidsService: BidsService,
    private readonly clsService: ClsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bid' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createBidDto: CreateBidDto) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    createBidDto.customer = context.user.id;
    return this.bidsService.create(createBidDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bids' })
  findAll() {
    return this.bidsService.findAll();
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
