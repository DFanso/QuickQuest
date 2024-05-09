import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from './services.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { NotFoundException, HttpException, HttpStatus } from '@nestjs/common';

describe('ServicesService', () => {
  let service: ServicesService;
  let model: Model<ServiceDocument>;

  const mockService = {
    _id: '647d9a6d7c9d44b9c6d9a6d9',
    name: 'Web Development',
    description: 'Full stack web development services',
    category: '62fc5b8f6d0b8b96d9f3c5e9',
    startingPrice: 500,
    imageUrl: 'http://example.com/service-image.png',
  };

  const mockCreateServiceDto: CreateServiceDto = {
    ...mockService,
  };

  const mockUpdateServiceDto: UpdateServiceDto = {
    name: 'Updated Web Development',
    description: 'Updated description',
    startingPrice: 800,
  };

  // Mock the Service schema
  const MockServiceSchema = {
    obj: {
      name: '',
      description: '',
      category: '',
      startingPrice: 0,
      imageUrl: '',
    },
  };

  // Mock the Service model
  const MockServiceModel = {
    create: jest.fn().mockImplementation((createServiceDto) => ({
      ...createServiceDto,
      save: jest.fn().mockResolvedValue(createServiceDto),
    })),
    find: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockService]),
      populate: jest.fn().mockReturnThis(),
    }),
    findOne: jest.fn().mockReturnThis(),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    deleteOne: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    where: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    schema: MockServiceSchema,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: getModelToken(Service.name),
          useValue: MockServiceModel,
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    model = module.get<Model<ServiceDocument>>(getModelToken(Service.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new service', async () => {
      const result = await service.create(mockCreateServiceDto);
      expect(result).toEqual(expect.objectContaining(mockCreateServiceDto));
    });
  });

  describe('findAll', () => {
    it('should return an array of services', async () => {
      const services = await service.findAll();
      expect(services).toEqual([mockService]);
    });
  });

  describe('findOne', () => {
    it('should return a service', async () => {
      MockServiceModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockService),
        populate: jest.fn().mockReturnThis(),
      });

      const foundService = await service.findOne({ _id: mockService._id });
      expect(foundService).toEqual(expect.objectContaining(mockService));
    });

    it('should throw NotFoundException when service is not found', async () => {
      MockServiceModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
        populate: jest.fn().mockReturnThis(),
      });

      await expect(service.findOne({ _id: 'invalid_id' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a service', async () => {
      MockServiceModel.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest
          .fn()
          .mockResolvedValueOnce({ ...mockService, ...mockUpdateServiceDto }),
      });

      const updatedService = await service.update(
        mockService._id,
        mockUpdateServiceDto,
      );
      expect(updatedService).toEqual(
        expect.objectContaining({ ...mockService, ...mockUpdateServiceDto }),
      );
    });

    it('should throw HttpException when service is not found', async () => {
      MockServiceModel.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(
        service.update('invalid_id', mockUpdateServiceDto),
      ).rejects.toThrow(
        new HttpException('Service not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('remove', () => {
    it('should remove a service', async () => {
      MockServiceModel.deleteOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce({ deletedCount: 1 }),
      });

      const result = await service.remove(mockService._id);
      expect(result).toEqual({ deleted: true, id: mockService._id });
    });

    it('should throw HttpException when service is not found', async () => {
      MockServiceModel.deleteOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce({ deletedCount: 0 }),
      });

      await expect(service.remove('invalid_id')).rejects.toThrow(
        new HttpException('Service not found', HttpStatus.NOT_FOUND),
      );
    });
  });
});
