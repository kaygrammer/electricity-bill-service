import { IsNotEmpty, IsIn } from 'class-validator';

export class UpdateBillStatusDto {
  @IsNotEmpty()
  @IsIn(['Pending', 'Paid'])
  status: 'Pending' | 'Paid';
}
