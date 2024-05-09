import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

describe('FeedbacksService', () => {
  let service: FeedbacksService;
  let mockFeedbackModel;

  beforeEach(async () => {
    mockFeedbackModel = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      aggregate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbacksService,
        {
          provide: getModelToken('Feedback'),
          useValue: mockFeedbackModel,
        },
      ],
    }).compile();

    service = module.get<FeedbacksService>(FeedbacksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new feedback', async () => {
      const createFeedbackDto: CreateFeedbackDto = {
        job: new Types.ObjectId().toString(),
        description: 'Great service!',
        stars: 5,
        customer: new Types.ObjectId().toString(),
        worker: new Types.ObjectId().toString(),
        service: new Types.ObjectId().toString(),
      };
      const createdFeedback = {
        _id: new Types.ObjectId(),
        ...createFeedbackDto,
      };
      mockFeedbackModel.create.mockResolvedValue(createdFeedback);

      const result = await service.create(createFeedbackDto);

      expect(mockFeedbackModel.create).toHaveBeenCalledWith(createFeedbackDto);
      expect(result).toEqual(createdFeedback);
    });
  });

  describe('findAll', () => {
    it('should return all feedbacks', async () => {
      const feedbacks = [
        { _id: new Types.ObjectId(), job: new Types.ObjectId(), stars: 4 },
        { _id: new Types.ObjectId(), job: new Types.ObjectId(), stars: 3 },
      ];
      mockFeedbackModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(feedbacks),
            }),
          }),
        }),
      });

      const result = await service.findAll({});

      expect(mockFeedbackModel.find).toHaveBeenCalledWith({});
      expect(result).toEqual(feedbacks);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if feedback not found', async () => {
      const feedbackId = new Types.ObjectId();
      mockFeedbackModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(null),
            }),
          }),
        }),
      });

      await expect(service.findOne(feedbackId.toString())).rejects.toThrow(
        `Feedback with ID "${feedbackId}" not found`,
      );
    });
  });

  describe('findAvgRatingByWorker', () => {
    it('should return avg rating and feedback count for a worker', async () => {
      const workerId = new Types.ObjectId();
      const result = [
        {
          _id: workerId,
          avgRating: 4,
          feedbackCount: 5,
        },
      ];
      mockFeedbackModel.aggregate.mockResolvedValue(result);

      const avgRating = await service.findAvgRatingByWorker(
        workerId.toString(),
      );

      expect(mockFeedbackModel.aggregate).toHaveBeenCalled();
      expect(avgRating).toEqual({ avgRating: 4, feedbackCount: 5 });
    });

    it('should return 0 avg rating and 0 feedback count if no feedbacks for worker', async () => {
      const workerId = new Types.ObjectId();
      mockFeedbackModel.aggregate.mockResolvedValue([]);

      const avgRating = await service.findAvgRatingByWorker(
        workerId.toString(),
      );

      expect(mockFeedbackModel.aggregate).toHaveBeenCalled();
      expect(avgRating).toEqual({ avgRating: 0, feedbackCount: 0 });
    });
  });
});
