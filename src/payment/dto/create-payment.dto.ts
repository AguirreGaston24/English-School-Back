import { IsArray, IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  teacher_id: string // ID del profesor

  @IsNotEmpty()
  @IsNumber()
  amount: number; // Monto de pago

  @IsNotEmpty()
  @IsString()
  month: string; // Mes del pago

  @IsNotEmpty()
  @IsString()
  firstName: string; // Nombre del profesor

  @IsNotEmpty()
  @IsString()
  lastName: string; // Apellido del profesor

  @IsNotEmpty()
  @IsString()
  dni: string; // DNI del profesor

  @IsArray()
  @IsString({ each: true })
  groupName: string[]; // Lista de nombres de grupos a los que pertenece el profesor

  @IsNotEmpty()
  @IsNumber()
  studentCount: number

}
