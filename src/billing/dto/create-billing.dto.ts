import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBillingDto {
  @IsString()
  student_id: string;

  @IsString()
  teacher_id: string;

  @IsBoolean()
  @IsOptional()
  pay_month: boolean;

  @IsBoolean()
  @IsOptional()
  deuda_month: boolean;

  @IsString()
  receipt_number: string;

  @IsString()
  month: string;

  @IsString()
  fee_type: string;

  @IsString()
  amount: string;

  @IsString()
  debe_amount: string;
}
