import { Test, TestingModule } from '@nestjs/testing';
import { OffersService } from './offers.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Offer, OfferDocument } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferStatus } from '../Types/offer.types';

describe('OffersService', () => {
  let service: OffersService;
  let model: Model<OfferDocument>;

  const mockOffer = {
    _id: '647d9a6d7c9d44b9c6d9a6d7',
    service: '647d9a6d7c9d44b9c6d9a6d7',
    worker: '647d9a6d7c9d44b9c6d9a6d8',
    price: 1000,
    description: 'This is an offer description',
    deliveryDate: new Date('2023-06-30T23:59:59.999Z'),
    status: OfferStatus.Pending,
    expireDate: new Date('2023-07-31T23:59:59.999Z'),
  };

  const mockCreateOfferDto: CreateOfferDto = {
    ...mockOffer,
  };

  const mockUpdateOfferDto: UpdateOfferDto = {
    price: 2000,
    description: 'Updated offer description',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OffersService,
        {
          provide: getModelToken(Offer.name),
          useValue: Model,
        },
      ],
    }).compile();

    service = module.get<OffersService>(OffersService);
    model = module.get<Model<OfferDocument>>(getModelToken(Offer.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new offer', async () => {
      jest.spyOn(model, 'create').mockImplementationOnce(() =>
        Promise.resolve({
          ...mockOffer,
          save: jest.fn(),
        } as any),
      );

      const result = await service.create(mockCreateOfferDto);
      expect(result).toEqual(expect.objectContaining(mockOffer));
    });
  });

  describe('findAll', () => {
    it('should return an array of offers', async () => {
      const mockOffers = [
        mockOffer,
        { ...mockOffer, _id: '647d9a6d7c9d44b9c6d9a6d9' },
      ];
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockOffers),
      } as any);

      const offers = await service.findAll();
      expect(offers).toEqual(mockOffers);
    });
  });

  describe('findOne', () => {
    it('should return an offer', async () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockOffer),
        populate: jest.fn().mockReturnThis(),
      } as any);

      const offer = await service.findOne({ _id: mockOffer._id });
      expect(offer).toEqual(expect.objectContaining(mockOffer));
    });
  });

  describe('update', () => {
    it('should update an offer', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
        exec: jest
          .fn()
          .mockResolvedValueOnce({ ...mockOffer, ...mockUpdateOfferDto }),
      } as any);

      const updatedOffer = await service.update(
        mockOffer._id,
        mockUpdateOfferDto,
      );
      expect(updatedOffer).toEqual(
        expect.objectContaining({ ...mockOffer, ...mockUpdateOfferDto }),
      );
    });
  });

  describe('remove', () => {
    it('should remove an offer', async () => {
      jest.spyOn(model, 'deleteOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce({ deletedCount: 1 }),
      } as any);

      const result = await service.remove(mockOffer._id);
      expect(result).toEqual({ deleted: true, id: mockOffer._id });
    });
  });

  describe('updateExpiredOffers', () => {
    it('should update expired offers', async () => {
      const expiredOffer = {
        ...mockOffer,
        expireDate: new Date('2023-04-01'),
        status: OfferStatus.Pending,
      };
      const mockOffers = [expiredOffer, mockOffer];
      jest.spyOn(model, 'updateMany').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockOffers),
      } as any);

      await service.updateExpiredOffers();
      expect(model.updateMany).toHaveBeenCalledWith(
        {
          expireDate: { $lte: expect.any(Date) },
          status: OfferStatus.Pending,
        },
        { $set: { status: OfferStatus.Expired } },
      );
    });
  });
});
