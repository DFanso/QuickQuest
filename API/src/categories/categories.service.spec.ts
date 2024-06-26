import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { CategoriesService } from './categories.service';
import { Category, CategoryDocument } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let model: Model<CategoryDocument>;

  const mockCategory = {
    _id: '647d9a6d7c9d44b9c6d9a6d7',
    name: 'Electronics',
    description: 'Devices and gadgets',
    iconUrl: 'http://example.com/icon.png',
  };

  beforeEach(async () => {
    const mockModel = {
      create: jest.fn().mockImplementation((createCategoryDto) => ({
        ...createCategoryDto,
        _id: mockCategory._id,
      })),
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockCategory]),
      }),
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCategory),
      }),
      findByIdAndUpdate: jest.fn().mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValue({ ...mockCategory, ...updateCategoryDto }),
      }),
      deleteOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getModelToken(Category.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    model = module.get<Model<CategoryDocument>>(getModelToken(Category.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Electronics',
        description: 'Devices and gadgets',
        iconUrl: 'http://example.com/icon.png',
      };

      const result = await service.create(createCategoryDto);
      expect(result).toEqual(mockCategory);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockCategory]);
    });
  });

  describe('findOne', () => {
    it('should find a category by filter', async () => {
      const filter = { name: 'Electronics' };
      const result = await service.findOne(filter);
      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException if category not found', async () => {
      const filter = { name: 'NonExistentCategory' };
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(service.findOne(filter)).rejects.toThrowError(
        'Category not found',
      );
    });
  });

  const updateCategoryDto: UpdateCategoryDto = {
    name: 'Updated Electronics',
    description: 'Updated devices and gadgets',
    iconUrl: 'http://example.com/updated-icon.png',
  };

  describe('update', () => {
    it('should update a category by id', async () => {
      const result = await service.update(mockCategory._id, updateCategoryDto);
      expect(result).toEqual({ ...mockCategory, ...updateCategoryDto });
    });

    it('should throw HttpException if category not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(
        service.update('invalid', updateCategoryDto),
      ).rejects.toThrowError('Category not found');
    });
  });

  describe('remove', () => {
    it('should remove a category by id', async () => {
      const result = await service.remove(mockCategory._id);
      expect(result).toEqual({ deleted: true, id: mockCategory._id });
    });

    it('should throw HttpException if category not found', async () => {
      jest.spyOn(model, 'deleteOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce({ deletedCount: 0 }),
      } as any);

      await expect(service.remove('invalid')).rejects.toThrowError(
        'Category not found',
      );
    });
  });
});
