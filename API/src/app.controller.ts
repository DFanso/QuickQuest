import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import * as os from 'os';
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
  getPing(): {
    status: number;
    data: string;
    latency: string;
    memoryUsage: string;
    cpuLoad: string;
  } {
    const startTime = Date.now(); // Capture start time

    // Heavy math calculation to simulate load
    this.heavyMathOperation();

    // Getting memory usage
    const usedMemory = os.totalmem() - os.freemem();
    const totalMemory = os.totalmem();
    const memoryUsage = `${(usedMemory / 1024 / 1024).toFixed(2)} MB of ${(totalMemory / 1024 / 1024).toFixed(2)} MB`;

    // Getting CPU load (simple measure)
    const cpus = os.cpus();
    const cpuLoad = cpus
      .map((cpu, index) => {
        const total = Object.values(cpu.times).reduce((acc, tv) => acc + tv, 0);
        const usage = ((total - cpu.times.idle) / total) * 100;
        return `CPU ${index}: ${usage.toFixed(2)}%`;
      })
      .join(', ');

    // Calculate processing time
    const processTime = Date.now() - startTime;

    // Return response with status, data, latency, memoryUsage, and cpuLoad
    return {
      status: HttpStatus.OK,
      data: 'pong',
      latency: `${processTime}ms`,
      memoryUsage,
      cpuLoad,
    };
  }

  private heavyMathOperation(): void {
    const iterations = 70000; // Adjust this number based on the desired load
    let result = 0;

    for (let i = 0; i < iterations; i++) {
      // Some pointless heavy calculations
      result += Math.sqrt(i) * Math.tan(i);
    }

    // eslint-disable-next-line no-console
    console.log(
      `Heavy math operation result (to ensure it's not optimized away): ${result}`,
    );
  }
}
