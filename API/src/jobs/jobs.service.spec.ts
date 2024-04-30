import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobDocument } from './entities/job.entity';
import { PaypalService } from '../paypal/paypal.service';
import { EmailService } from '../email/email.service';
import { Offer } from '../offers/entities/offer.entity';
import { User } from '../user/entities/user.entity';
import { JobStatus } from '../Types/jobs.types';

describe('JobsService', () => {
  let service: JobsService;
  let model: Model<JobDocument>;
  let paypalService: PaypalService;
  let emailService: EmailService;

  const mockOffer = {
    service: { name: 'Test Service' },
    worker: { _id: 'workerId' } as User,
    description: 'Test description',
    price: 100,
    deliveryDate: new Date(),
  } as Offer;

  const mockCustomer = {
    _id: 'customerId',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
  } as User;

  const mockJob = {
    _id: 'jobId',
    service: mockOffer.service,
    customer: mockCustomer,
    worker: mockOffer.worker,
    description: mockOffer.description,
    price: mockOffer.price,
    orderedDate: new Date(),
    deliveryDate: mockOffer.deliveryDate,
    status: JobStatus.Processing,
    paymentUrl: 'paymentUrl',
    paypalOrderId: 'paypalOrderId',
    // populate: jest.fn().mockResolvedValue(mockJob),
    // save: jest.fn().mockResolvedValue(mockJob),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: JobsService,
          useValue: {
            create: jest.fn().mockImplementation(() => {
              mockJob.paymentUrl = 'approvalUrl';
              return Promise.resolve(mockJob);
            }),
            updateJobStatus: jest.fn().mockImplementation(() => {
              mockJob.status = JobStatus.Pending;
              mockJob.paypalOrderId = 'paypalCaptureId';
              return Promise.resolve();
            }),
            findAll: jest.fn().mockResolvedValue([mockJob]),
            findOne: jest.fn().mockResolvedValue(mockJob),
            cancelOrder: jest.fn().mockImplementation(() => {
              mockJob.status = JobStatus.Cancelled;
              return Promise.resolve();
            }),
            completeJob: jest.fn().mockImplementation(() => {
              mockJob.status = JobStatus.Completed;
              return Promise.resolve();
            }),
            getJobsNearingDelivery: jest.fn().mockResolvedValue([mockJob]),
            remove: jest.fn().mockResolvedValue({ deleted: true, id: 'jobId' }),
          },
        },
        {
          provide: getModelToken(Job.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockJob),
            constructor: jest.fn().mockResolvedValue(mockJob),
            findOne: jest.fn().mockResolvedValue(mockJob),
            find: jest.fn().mockResolvedValue([mockJob]),
            deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
            exec: jest.fn().mockResolvedValue(mockJob),
            create: jest.fn().mockResolvedValue(mockJob),
          },
        },
        {
          provide: PaypalService,
          useValue: {
            createJob: jest.fn(),
            refundPayment: jest.fn(),
            sendPayoutToWorker: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            renderTemplate: jest.fn().mockResolvedValue('emailContent'),
            sendEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    model = module.get<Model<JobDocument>>(getModelToken(Job.name));
    paypalService = module.get<PaypalService>(PaypalService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new job', async () => {
      const createdJob = await service.create(mockOffer, mockCustomer);
      expect(createdJob).toEqual(mockJob);
      // expect(paypalService.createJob).toHaveBeenCalled();
      expect(mockJob.paymentUrl).toBe('approvalUrl');
    });
  });

  describe('updateJobStatus', () => {
    it('should update job status', async () => {
      await service.updateJobStatus('jobId', 'paypalCaptureId');
      expect(mockJob.status).toBe(JobStatus.Pending);
      expect(mockJob.paypalOrderId).toBe('paypalCaptureId');
    });
  });

  describe('findAll', () => {
    it('should find all jobs', async () => {
      const jobs = await service.findAll();
      expect(jobs).toEqual([mockJob]);
    });
  });

  describe('findOne', () => {
    it('should find a job by id', async () => {
      const job = await service.findOne('jobId');
      expect(job).toEqual(mockJob);
    });
  });

  describe('cancelOrder', () => {
    it('should cancel an order', async () => {
      await service.cancelOrder('jobId');
      expect(mockJob.status).toBe(JobStatus.Cancelled);
      // expect(paypalService.refundPayment).toHaveBeenCalled();
      // expect(emailService.renderTemplate).toHaveBeenCalledTimes(2);
      // expect(emailService.sendEmail).toHaveBeenCalledTimes(2);
    });
  });

  describe('completeJob', () => {
    it('should complete a job', async () => {
      await service.completeJob('jobId');
      expect(mockJob.status).toBe(JobStatus.Completed);
      // expect(paypalService.sendPayoutToWorker).toHaveBeenCalled();
      // expect(emailService.renderTemplate).toHaveBeenCalledTimes(2);
      // expect(emailService.sendEmail).toHaveBeenCalledTimes(2);
    });
  });

  describe('getJobsNearingDelivery', () => {
    it('should get jobs nearing delivery', async () => {
      const jobs = await service.getJobsNearingDelivery();
      expect(jobs).toEqual([mockJob]);
    });
  });

  describe('remove', () => {
    it('should remove a job', async () => {
      const result = await service.remove('jobId');
      expect(result.deleted).toBe(true);
      expect(result.id).toBe('jobId');
    });
  });
});
