import { IsString, IsNumber, IsPhoneNumber, IsOptional, Min, Matches, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateBillingDto {
  @IsString()
  student_id: string;

  @IsBoolean()
  @IsOptional()
  deuda_month: boolean;

  @IsString()
  month: string;

  @IsString()
  beca: string;  // Cambia a número para realizar operaciones aritméticas.

  @IsNumber()
  amount: number;  // Cambia a número para realizar operaciones aritméticas.

  @IsNumber()
  @IsOptional()  // Lo hacemos opcional porque se calculará automáticamente.
  debe_amount: number;

  @IsString()
  phone: string;

  @IsString()
  payment_type: string;

  @IsString()
  amount_to_pay: number;

  @IsNotEmpty()
  @IsString()
  group_id: string;

}
