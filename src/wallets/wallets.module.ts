import { Module } from '@nestjs/common';
import { WalletService } from './wallets.service';
import { WalletController } from './wallets.controller';

@Module({
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletsModule {}
