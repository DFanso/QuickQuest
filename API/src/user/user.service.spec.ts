import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClsService } from 'nestjs-cls';
import { FeedbacksService } from '../feedbacks/feedbacks.service';
import { HttpException } from '@nestjs/common';
import { UserStatus, UserType } from '../Types/user.types';

describe('UserService', () => {
  let service: UserService;
  let model: Model<UserDocument>;
  let clsService: ClsService;
  let feedbacksService: FeedbacksService;

  const mockUser: User = {
    _id: '647d9a6d7c9d44b9c6d9a6d9', // Change 'unknown' to a string
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    type: UserType.Customer,
    status: UserStatus.Unverified,
    location: {
      type: 'Point',
      coordinates: [-73.856077, 40.848447],
    },
    profileImage: 'http://example.com/profile.jpg',
    userId: '',
    paypalEmail: '',
  };

  const mockCreateUserDto: CreateUserDto = {
    ...mockUser,
    password: 'Password@123',
    services: mockUser.services?.map((service) => service.toString()), // Convert Types.ObjectId to string
  };

  const mockUpdateUserDto: UpdateUserDto = {
    firstName: 'Updated John',
    lastName: 'Updated Doe',
    aboutMe: 'Updated about me section',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
        {
          provide: ClsService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: FeedbacksService,
          useValue: {
            findAvgRatingByWorker: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<UserDocument>>(getModelToken(User.name));
    clsService = module.get<ClsService>(ClsService);
    feedbacksService = module.get<FeedbacksService>(FeedbacksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      jest.spyOn(model, 'create').mockImplementationOnce(() =>
        Promise.resolve({
          ...mockCreateUserDto,
          save: jest.fn(),
        } as any),
      );

      const result = await service.create(mockCreateUserDto);
      expect(result).toEqual(expect.objectContaining(mockCreateUserDto));
    });
  });

  describe('findAll', () => {
    it('should return the context from the clsService', () => {
      const mockContext = { user: mockUser };
      clsService.get = jest.fn().mockReturnValueOnce(mockContext);

      const result = service.findAll();
      expect(result).toEqual(mockContext);
    });

    it('should throw an error when context is not found', () => {
      clsService.get = jest.fn().mockReturnValueOnce(null);

      expect(() => service.findAll()).toThrow(HttpException);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
        populate: jest.fn().mockReturnThis(),
      } as any);

      const foundUser = await service.findOne({ _id: mockUser._id });
      expect(foundUser).toEqual(expect.objectContaining(mockUser));
    });
  });
  describe('update', () => {
    it('should update a user', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
        exec: jest
          .fn()
          .mockResolvedValueOnce({ ...mockUser, ...mockUpdateUserDto }),
      } as any);

      const updatedUser = await service.update(
        mockUser._id.toString(),
        mockUpdateUserDto,
      );
      expect(updatedUser).toEqual(
        expect.objectContaining({ ...mockUser, ...mockUpdateUserDto }),
      );
    });

    it('should throw an error when user is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(
        service.update('invalid_id', mockUpdateUserDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(model, 'deleteOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce({ deletedCount: 1 }),
      } as any);

      const result = await service.remove(mockUser._id.toString());
      expect(result).toEqual({ deleted: true, id: mockUser._id });
    });

    it('should throw an error when user is not found', async () => {
      jest.spyOn(model, 'deleteOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce({ deletedCount: 0 }),
      } as any);

      await expect(service.remove('invalid_id')).rejects.toThrow(HttpException);
    });
  });
});
