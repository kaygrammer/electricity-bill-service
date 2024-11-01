import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { Bill } from './bill.model';
import { Wallet } from 'src/wallets/wallet.model';
import { WalletService } from 'src/wallets/wallets.service';
import { EventEmitter2 } from 'eventemitter2';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillStatusDto } from './dto/update-bill-status.dto';
import { ProviderAService } from './providers/provider-a.service';
import { ProviderBService } from './providers/provider-b.service';
import { BillPaidEvent } from './events/bill-paid.event';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class BillsService {
  constructor(
    private readonly walletService: WalletService,
    private readonly eventEmitter: EventEmitter2,
    private readonly providerAService: ProviderAService,
    private readonly providerBService: ProviderBService,
    private readonly sequelize: Sequelize,
  ) {}

  async createBill(userId: string, createBillDto: CreateBillDto): Promise<Bill> {
    try {
      console.log(createBillDto);
      const parsedAmount = parseFloat(createBillDto.amount.toString());

      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new BadRequestException('Invalid amount provided');
      }

      const bill = await Bill.create({
        userId,
        amount: parsedAmount,
        meterNumber: createBillDto.meterNumber,
        provider: createBillDto.provider,
        status: 'Pending',
      });

      this.eventEmitter.emit('bill_created', {
        billId: bill.id,
        userId: bill.userId,
        amount: bill.amount,
      });

      return bill;
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Failed to create bill');
    }
  }

  async getBillById(billId: string): Promise<Bill> {
    try {
      const bill = await Bill.findOne({ where: { id: billId } });
      if (!bill) {
        throw new NotFoundException('Bill not found');
      }
      return bill;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve bill');
    }
  }

  async updateBillStatus(billId: string, updateBillStatusDto: UpdateBillStatusDto): Promise<Bill> {
    try {
      const bill = await this.getBillById(billId);

      bill.status = updateBillStatusDto.status;
      await bill.save();

      return bill;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update bill status');
    }
  }

  async getAllBillsByUserId(userId: string): Promise<Bill[]> {
    try {
      const bills = await Bill.findAll({ where: { userId } });
      return bills;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve bills');
    }
  }

  private validateBill(bill: Bill, wallet: Wallet): void {
    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    if (bill.status === 'Paid') {
      throw new BadRequestException('This bill has already been paid');
    }

    const walletBalance = parseFloat(wallet.balance.toString());
    const billAmount = parseFloat(bill.amount.toString());
    if (walletBalance < billAmount) {
      this.eventEmitter.emit('low_balance', { userId: bill.userId, balance: wallet.balance });
      throw new BadRequestException('Insufficient funds in wallet');
    }
  }

  private async processPayment(provider: 'A' | 'B', billAmount: number): Promise<boolean> {
    switch (provider) {
      case 'B':
        return await this.providerBService.processPayment(billAmount);
      case 'A':
      default:
        return await this.providerAService.processPayment(billAmount);
    }
  }

  private async finalizeBillPayment(walletId: string, bill: Bill, provider: 'A' | 'B', billAmount: number): Promise<Bill> {
    return this.sequelize.transaction(async (transaction) => {
      const paymentSuccess = await this.processPayment(provider, billAmount);

      if (!paymentSuccess) {
        throw new InternalServerErrorException('Failed to process payment with provider');
      }

      await this.walletService.deductFunds(walletId, billAmount, transaction);

      bill.status = 'Paid';
      await bill.save({ transaction });

      this.eventEmitter.emit('bill_paid', { billId: bill.id, userId: bill.userId, amount: billAmount });

      return bill;
    });
  }

  async payBill(userId: string, validationRef: string): Promise<Bill> {
    const wallet = await this.walletService.findWalletByUserId(userId);
    const bill = await this.getBillById(validationRef);

    this.validateBill(bill, wallet);

    const provider = bill.provider as 'A' | 'B';
    const billAmount = parseFloat(bill.amount.toString());

    return this.finalizeBillPayment(wallet.id, bill, provider, billAmount);
  }
}
