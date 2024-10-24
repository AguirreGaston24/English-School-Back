import { IsString, IsNumber, IsPhoneNumber, IsOptional, Min, Matches, IsBoolean } from 'class-validator';

export class CreateBillingDto {
  @IsString()
  student_id: string;

  @IsBoolean()
  @IsOptional()
  deuda_month: boolean;

  @IsNumber()
  receipt_number: number;

  @IsString()
  month: string;

  @IsString()
  beca: string;  // Cambia a número para realizar operaciones aritméticas.

  @IsString()
  amount: string;  // Cambia a número para realizar operaciones aritméticas.

  @IsNumber()
  @IsOptional()  // Lo hacemos opcional porque se calculará automáticamente.
  debe_amount: number;

  @IsString()
  phone: string;

  @IsString()
  payment_type: string;
}
