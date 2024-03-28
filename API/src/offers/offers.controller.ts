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
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Offer } from './entities/offer.entity';
import { ServicesService } from 'src/services/services.service';
import { AuthGuard } from '@nestjs/passport';
import { AppClsStore, UserType } from 'src/Types/user.types';
import { ClsService } from 'nestjs-cls';
import { UserService } from 'src/user/user.service';
import { JobsService } from 'src/jobs/jobs.service';
import { Job } from 'src/jobs/entities/job.entity';
import { OfferStatus } from 'src/Types/offer.types';

@ApiTags('offers')
@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly serviceService: ServicesService,
    private readonly clsService: ClsService,
    private readonly userService: UserService,
    private readonly jobService: JobsService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new offer' })
  @ApiBody({ type: CreateOfferDto })
  @ApiResponse({
    status: 201,
    description: 'The offer has been successfully created',
    type: Offer,
  })
  async create(@Body() createOfferDto: CreateOfferDto) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.findOne({ _id: context.user.id });
    if (!user || user.type != UserType.Worker) {
      throw new HttpException('Unauthorized User', HttpStatus.UNAUTHORIZED);
    }
    createOfferDto.worker = user._id;
    const service = await this.serviceService.findOne({
      _id: createOfferDto.service,
    });
    if (!service) {
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    }
    if (createOfferDto.price <= service.startingPrice) {
      throw new HttpException(
        'Price too low for the service starting price',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.offersService.create(createOfferDto);
  }

  @ApiOperation({ summary: 'Accept an offer' })
  @ApiResponse({
    status: 200,
    description: 'Offer accepted successfully',
    type: Offer,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Offer not found' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/accept')
  async acceptOffer(@Param('id') id: string): Promise<Job> {
    try {
      const context = this.clsService.get<AppClsStore>();
      if (!context || !context.user) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
      const user = await this.userService.findOne({ _id: context.user.id });
      if (!user || user.type !== UserType.Customer) {
        throw new HttpException('Unauthorized User', HttpStatus.UNAUTHORIZED);
      }
      const offer = await this.offersService.findOne({ _id: id });
      if (
        !offer ||
        offer.status === OfferStatus.Expired ||
        offer.status === OfferStatus.Accepted
      ) {
        throw new HttpException(
          'Offer expired, accepted or not found',
          HttpStatus.NOT_FOUND,
        );
      }
      const job = await this.jobService.create(offer, user);
      if (job) {
        const updateOfferDto: UpdateOfferDto = {
          status: OfferStatus.Accepted,
        };
        await this.offersService.update(id, updateOfferDto);
        return job;
      } else {
        throw new HttpException(
          'Failed to create job',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
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
    return this.offersService.findOne({ _id: id });
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
