import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Offer } from './entities/offer.entity';

@ApiTags('offers')
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new offer' })
  @ApiBody({ type: CreateOfferDto })
  @ApiResponse({
    status: 201,
    description: 'The offer has been successfully created',
    type: Offer,
  })
  create(@Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all offers' })
  @ApiResponse({
    status: 200,
    description: 'The list of offers',
    type: [Offer],
  })
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single offer by ID' })
  @ApiResponse({ status: 200, description: 'The offer', type: Offer })
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an offer by ID' })
  @ApiBody({ type: UpdateOfferDto })
  @ApiResponse({ status: 200, description: 'The updated offer', type: Offer })
  update(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto) {
    return this.offersService.update(id, updateOfferDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an offer by ID' })
  @ApiResponse({ status: 200, description: 'The deleted offer', type: Offer })
  remove(@Param('id') id: string) {
    return this.offersService.remove(id);
  }
}
