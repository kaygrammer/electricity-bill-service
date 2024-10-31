import { Injectable } from '@nestjs/common';

@Injectable()
export class ProviderAService {
  async processPayment(amount: number): Promise<boolean> {
    console.log(`Processing payment of ${amount} with Provider A...`);
    return true;
  }
}
