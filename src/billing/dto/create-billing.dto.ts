import { IsBoolean, IsOptional, IsString } from "class-validator";

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

  @IsString()
  scholarshipType: string;

  @IsString()
  amount: string;

  @IsString()
  feeAmount: string;
}
