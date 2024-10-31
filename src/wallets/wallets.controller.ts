import { Controller, Post, Body, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { WalletService } from './wallets.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Wallet } from './wallet.model';
import { ApiResponse } from 'src/responses/api-response.interface';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/add-funds')
  async addFunds(@Request() req: any, @Body('amount') amount: number): Promise<ApiResponse<Wallet>> {
    const userId = req.user.userId;

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    const updatedWallet = await this.walletService.addFunds(userId, amount);

    return {
      success: true,
      message: 'Funds added successfully',
      data: updatedWallet,
    };
  }
}
