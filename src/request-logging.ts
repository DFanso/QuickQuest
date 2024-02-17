import { Logger, INestApplication } from '@nestjs/common';
import * as morgan from 'morgan';

export function useRequestLogging(app: INestApplication) {
  const logger = new Logger('Request');
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => logger.log(message.replace('\n', '')),
      },
    }),
  );
}
