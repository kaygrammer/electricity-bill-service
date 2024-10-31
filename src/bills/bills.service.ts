import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { Bill } from './bill.model';
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
      const parsedAmount = parseFloat(createBillDto.amount.toString());

      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new BadRequestException('Invalid amount provided');
      }

      const bill = await Bill.create({ userId, amount: parsedAmount, status: 'Pending' });

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

  async payBill(userId: string, billId: string, provider: 'A' | 'B', transactionId: string): Promise<Bill> {
    const wallet = await this.walletService.findWalletByUserId(userId);

    const walletBalance = parseFloat(wallet.balance.toString());
    const bill = await this.getBillById(billId);

    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    if (bill.status === 'Paid') {
      throw new BadRequestException('This bill has already been paid');
    }

    const existingPayment = await Bill.findOne({ where: { transactionId } });
    if (existingPayment) {
      throw new BadRequestException('Possible duplicate payment detected');
    }

    const billAmount = parseFloat(bill.amount.toString());
    if (walletBalance < billAmount) {
      this.eventEmitter.emit('low_balance', { userId: bill.userId, balance: wallet.balance });
      throw new BadRequestException('Insufficient funds in wallet');
    }

    return this.sequelize.transaction(async (transaction) => {
      let paymentSuccess: boolean;
      if (provider === 'A') {
        paymentSuccess = await this.providerAService.processPayment(billAmount);
      } else {
        paymentSuccess = await this.providerBService.processPayment(billAmount);
      }

      if (!paymentSuccess) {
        throw new InternalServerErrorException('Failed to process payment with provider');
      }

      await this.walletService.deductFunds(wallet.id, billAmount, transaction);

      bill.status = 'Paid';
      bill.transactionId = transactionId;
      await bill.save({ transaction });

      this.eventEmitter.emit('bill_paid', { billId: bill.id, userId: bill.userId, amount: billAmount });

      return bill;
    });
  }
}
