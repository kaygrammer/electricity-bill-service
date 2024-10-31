import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AwsSnsService } from 'src/common/services/aws-sns.service';
import { SmsService } from 'src/common/services/sms.service';
import { BillCreatedEvent } from './events/bill-created.event';
import { BillPaidEvent } from './events/bill-paid.event';

@Injectable()
export class BillingEventsService {
  constructor(
    private readonly awsSnsService: AwsSnsService,
    private readonly smsService: SmsService,
  ) {}
  private readonly logger = new Logger(BillingEventsService.name);

  @OnEvent('bill_created')
  async handleBillCreatedEvent(payload: BillCreatedEvent) {
    this.logger.log(`Handling 'bill_created' event for Bill ID: ${payload.billId}`);

    await this.awsSnsService.publish('arn:aws:sns:us-east-1:000000000000:bill_created', JSON.stringify(payload));

    const userPhoneNumber = '07067844463';
    await this.smsService.sendSms(userPhoneNumber, `A new bill of ${payload.amount} has been created.`);

    this.logger.log(`Bill created for User ID: ${payload.userId} with amount: ${payload.amount}`);
  }

  @OnEvent('bill_paid')
  async handleBillPaidEvent(payload: BillPaidEvent) {
    this.logger.log(`Handling 'bill_paid' event for Bill ID: ${payload.billId}`);

    await this.awsSnsService.publish('arn:aws:sns:us-east-1:000000000000:bill_paid', JSON.stringify(payload));

    const userPhoneNumber = '07067844463';
    await this.smsService.sendSms(userPhoneNumber, `Your bill of ${payload.amount} has been successfully paid.`);

    this.logger.log(`Bill payment confirmed for User ID: ${payload.userId} with amount: ${payload.amount}`);
  }

  @OnEvent('low_balance')
  async handleLowBalanceEvent(payload: { userId: string; balance: number }) {
    this.logger.log(`Handling 'low_balance' event for User ID: ${payload.userId}`);

    const userPhoneNumber = '07067844463';
    await this.smsService.sendSms(userPhoneNumber, `Warning: Your wallet balance is low. Current balance: ${payload.balance}. Please top up to avoid service interruptions.`);

    this.logger.log(`Low balance notification sent for User ID: ${payload.userId} with balance: ${payload.balance}`);
  }
}
