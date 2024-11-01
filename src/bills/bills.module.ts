import { Module } from '@nestjs/common';
import { BillsService } from './bills.service';
import { WalletsModule } from '../wallets/wallets.module';
import { AwsSnsService } from 'src/common/services/aws-sns.service';
import { SmsService } from 'src/common/services/sms.service';
import { BillsController } from './bills.controller';
import { BillingEventsService } from './billing-events.service';
import { ProviderAService } from './providers/provider-a.service';
import { ProviderBService } from './providers/provider-b.service';

@Module({
  imports: [WalletsModule],
  providers: [BillsService, BillingEventsService, AwsSnsService, SmsService, ProviderAService, ProviderBService],
  controllers: [BillsController],
})
export class BillsModule {}
