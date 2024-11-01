import { IsNotEmpty, IsNumber, IsString, IsIn } from 'class-validator';

export class CreateBillDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty({ message: 'Meter number is required' })
  @IsString()
  meterNumber: string;

  @IsNotEmpty({ message: 'Provider is required' })
  @IsString()
  @IsIn(['A', 'B'], { message: 'Provider must be either A or B' })
  provider: 'A' | 'B';
}
