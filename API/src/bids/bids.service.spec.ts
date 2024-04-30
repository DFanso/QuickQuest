/* eslint-disable no-console */
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { ClsService } from 'nestjs-cls';
import { UserService } from '../user/user.service';
import { BidsService } from './bids.service';
import { Bid, BidDocument } from './entities/bid.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { NotFoundException } from '@nestjs/common';

describe('BidsService', () => {
  let service: BidsService;
  let model: Model<BidDocument>;
  let userService: UserService;
  let clsService: ClsService;

  const mockBid = {
    _id: '647d9a6d7c9d44b9c6d9a6d7',
    customer: '647d9a6d7c9d44b9c6d9a6d8',
    service: '647d9a6d7c9d44b9c6d9a6d9',
    budget: 1000,
    description: 'This is a bid description',
    expireDate: new Date('2023-06-30T23:59:59.999Z'),
  };

  const mockUser = {
    _id: '647d9a6d7c9d44b9c6d9a6d8',
    services: [{ id: '647d9a6d7c9d44b9c6d9a6d9' }],
  };

  beforeEach(async () => {
    const mockQuery = {
      find: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      equals: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockBid]),
      countDocuments: jest.fn().mockResolvedValue(15),
    };

    const mockModel = {
      create: jest.fn().mockResolvedValue(mockBid),
      find: jest.fn().mockReturnValue(mockQuery),
      findById: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBid),
      }),
      findByIdAndUpdate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ ...mockBid, ...updateBidDto }),
      }),
      deleteOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      }),
      countDocuments: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(15),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BidsService,
        {
          provide: getModelToken(Bid.name),
          useValue: mockModel,
        },
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: ClsService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<BidsService>(BidsService);
    model = module.get<Model<BidDocument>>(getModelToken(Bid.name));
    userService = module.get<UserService>(UserService);
    clsService = module.get<ClsService>(ClsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new bid', async () => {
      const createBidDto: CreateBidDto = {
        customer: '647d9a6d7c9d44b9c6d9a6d8',
        service: '647d9a6d7c9d44b9c6d9a6d9',
        budget: 1000,
        description: 'This is a bid description',
        expireDate: new Date('2023-06-30T23:59:59.999Z'),
      };

      const result = await service.create(createBidDto);
      expect(result).toEqual(mockBid);
    });
  });

  describe('findMatchingBids', () => {
    it('should find matching bids for a worker', async () => {
      const result = await service.findMatchingBids(mockUser._id);
      expect(result).toEqual([mockBid]);
    });

    it('should throw NotFoundException if worker is not found', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.findMatchingBids('nonexistentUserId'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should find all bids with pagination', async () => {
      const result = await service.findAll(1, 10);
      expect(result).toEqual({
        bids: [mockBid],
        totalPages: 2,
      });
    });

    it('should find all bids for a specific customer', async () => {
      const result = await service.findAll(1, 10, mockUser._id);
      expect(result).toEqual({
        bids: [mockBid],
        totalPages: 2,
      });
    });
  });

  describe('findOne', () => {
    it('should find a bid by id', async () => {
      const result = await service.findOne(mockBid._id);
      expect(result).toEqual(mockBid);
    });
  });

  const updateBidDto: UpdateBidDto = {
    budget: 2000,
    description: 'Updated bid description',
    expireDate: new Date('2023-07-31T23:59:59.999Z'),
  };

  describe('update', () => {
    it('should update a bid by id', async () => {
      const result = await service.update(mockBid._id, updateBidDto);
      expect(result).toEqual({ ...mockBid, ...updateBidDto });
    });
  });

  describe('remove', () => {
    it('should remove a bid by id', async () => {
      const result = await service.remove(mockBid._id);
      expect(result).toEqual({ deleted: true, id: mockBid._id });
    });
  });
});
