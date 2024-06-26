import { IsBoolean, IsDateString, IsNumber, IsString } from "class-validator";

export class CreateBillingDto {
  @IsString()
  studentId: string;

  @IsNumber()
  year: number;

  @IsBoolean()
  pay_month: boolean;

  @IsBoolean()
  deuda_month: boolean;

  @IsNumber()
  receiptNumber: number;

  @IsString()
  month: string;

  @IsString()
  scholarshipType: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  feeAmount: number;

  @IsDateString()
  paymentDate: Date;

  @IsString()
  description: string;
}
