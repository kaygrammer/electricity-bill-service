import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsSnsService {
  async publish(topicArn: string, message: string): Promise<void> {
    console.log(`Mocked SNS Publish to ${topicArn} with message: ${message}`);
  }
}
