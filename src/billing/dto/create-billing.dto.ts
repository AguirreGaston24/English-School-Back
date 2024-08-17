import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBillingDto {
  @IsString()
  studentId: string;

  @IsBoolean()
  @IsOptional()
  pay_month: boolean;

  @IsBoolean()
  @IsOptional()
  deuda_month: boolean;

  @IsString()
  receiptNumber: string;

  @IsString()
  month: string;

  @IsNumber()
  scholarshipType: number;

  @IsString()
  amount: string;

  @IsString()
  feeAmount: string;
}
