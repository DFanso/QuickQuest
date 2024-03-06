import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/ping')
  @HttpCode(HttpStatus.OK) // Explicitly setting HTTP status code to 200
  getPing(): { status: number; data: string; latency: string } {
    const startTime = Date.now(); // Capture start time

    // Simulate processing (this can be your actual logic)
    const processTime = Date.now() - startTime; // Calculate processing time

    // Return response with status, data, and latency
    return {
      status: HttpStatus.OK, // HTTP Status Code
      data: 'pong', // Response data
      latency: `${processTime}ms`, // Processing time in milliseconds
    };
  }
}
