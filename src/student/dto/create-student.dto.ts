import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateStudentDto {
  @IsString() firstname: string;
  @IsString() lastname: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() phone?: string;
  @IsString() country: string;
  @IsString() city: string;
  @IsString() address: string;
  @IsString() district: string;
  @IsString() dni: string;
  @IsString() school: string;
  @IsOptional() @IsString() group?: string;
  @IsOptional() @IsString() teacher?: string;
  @IsOptional() @IsString() teacherId?: string;
  @IsOptional() @IsString() birth_date?: string;
  @IsString() tutor: string;
  @IsString() tutor_occupation: string;
  @IsString() tutor_phone: string;
  @IsString() tutor_address: string;
  @IsString() tutor_district: string;
}
  