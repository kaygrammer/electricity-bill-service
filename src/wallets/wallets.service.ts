import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Wallet } from './wallet.model';
import { Transaction } from 'sequelize';

@Injectable()
export class WalletService {
  async createWallet(userId: string): Promise<Wallet> {
    return await Wallet.create({ userId, balance: 0 });
  }

  async findWalletByUserId(userId: string, transaction?: Transaction): Promise<Wallet> {
    const wallet = await Wallet.findOne({ where: { userId }, transaction });
    if (!wallet) {
      throw new NotFoundException('Wallet not found for this user');
    }
    return wallet;
  }

  async addFunds(userId: string, amount: number): Promise<Wallet> {
    try {
      const wallet = await Wallet.findOne({ where: { userId } });
      if (!wallet) {
        throw new NotFoundException('Wallet not found for this user');
      }

      const amountToAdd = parseFloat(amount.toString());

      wallet.balance = parseFloat(wallet.balance.toString()) + amountToAdd;

      await wallet.save();

      return wallet;
    } catch (error) {
      console.error('Error adding funds to wallet:', error);
      throw new InternalServerErrorException('Failed to add funds to wallet');
    }
  }

  async deductFunds(walletId: string, amount: number, transaction?: Transaction): Promise<Wallet> {
    const wallet = await Wallet.findOne({
      where: { id: walletId },
      lock: transaction?.LOCK.UPDATE,
      transaction,
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const amountToDeduct = parseFloat(amount.toString());
    const currentBalance = parseFloat(wallet.balance.toString());

    if (currentBalance < amountToDeduct) {
      throw new BadRequestException('Insufficient funds in wallet');
    }

    wallet.balance = currentBalance - amountToDeduct;

    await wallet.save({ transaction });

    return wallet;
  }
}
