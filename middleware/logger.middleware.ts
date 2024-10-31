import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, headers, query, body } = req;

    this.logger.log(`Incoming Request: ${method} ${url}`);
    this.logger.log(`Headers: ${JSON.stringify(headers)}`);
    this.logger.log(`Query Params: ${JSON.stringify(query)}`);
    this.logger.log(`Request Body: ${JSON.stringify(body)}`);

    res.on('finish', () => {
      this.logger.log(`Response Status: ${res.statusCode}`);
    });

    next();
  }
}
