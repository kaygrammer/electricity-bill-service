import { Injectable } from '@nestjs/common';

@Injectable()
export class ProviderBService {
  async processPayment(amount: number): Promise<boolean> {
    console.log(`Processing payment of ${amount} with Provider B...`);
    return true;
  }
}
