import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RecommendationDto } from './dto/recommendation.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RecommendationsService {
  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(userId: string): Promise<RecommendationDto[]> {
    const requestBody = { userId };

    const response = await this.httpService
      .post(
        `${this.configService.get<string>('RECOMMENDATION_ENGINE_API')}/recommendations`,
        requestBody,
      )
      .toPromise();

    return response.data.recommendations;
  }
}
