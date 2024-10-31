import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBillDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
