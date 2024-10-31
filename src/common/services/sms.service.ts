import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
  async sendSms(phoneNumber: string, message: string): Promise<void> {
    console.log(`Mocked SMS sent to ${phoneNumber}: ${message}`);
  }
}
