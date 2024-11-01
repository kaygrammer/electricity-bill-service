import { Controller, Post, Get, Param, Body, Put, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { BillsService } from './bills.service';
import { Bill } from './bill.model';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillStatusDto } from './dto/update-bill-status.dto';
import { ApiResponse } from 'src/responses/api-response.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { v4 as uuidv4 } from 'uuid';

@Controller('electricity')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  async createBill(@Request() req: any, @Body() createBillDto: CreateBillDto): Promise<ApiResponse<Bill>> {
    const userId = req.user.userId;

    const bill = await this.billsService.createBill(userId, createBillDto);

    return {
      success: true,
      message: 'Bill created successfully',
      data: bill,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('Vend/:validationRef/pay')
  async payBill(@Param('validationRef') validationRef: string, @Request() req: any): Promise<ApiResponse<Bill>> {
    const userId = req.user.userId;

    const payment = await this.billsService.payBill(userId, validationRef);

    return {
      success: true,
      message: 'Bill paid successfully and wallet charged successfully',
      data: payment,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getBillById(@Param('id') billId: string): Promise<ApiResponse<Bill>> {
    const bill = await this.billsService.getBillById(billId);

    return {
      success: true,
      message: 'Bill retrieved successfully',
      data: bill,
    };
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateBillStatus(@Param('id') billId: string, @Body() updateBillStatusDto: UpdateBillStatusDto): Promise<ApiResponse<Bill>> {
    const bill = await this.billsService.updateBillStatus(billId, updateBillStatusDto);

    return {
      success: true,
      message: 'Bill status updated successfully',
      data: bill,
    };
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  async getAllBillsByUserId(@Param('userId') userId: string): Promise<ApiResponse<Bill[]>> {
    const bills = await this.billsService.getAllBillsByUserId(userId);

    return {
      success: true,
      message: 'Bills retrieved successfully',
      data: bills,
    };
  }
}
