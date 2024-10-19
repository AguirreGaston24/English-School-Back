import { IsEmail, IsOptional, IsString, IsInt, Max } from "class-validator";

export class CreateTeacherDto {
  @IsString() firstname: string;
  @IsString() lastname: string;
  @IsString() start_date: string;
  @IsEmail() email: string;
  @IsString() @IsOptional() phone: string;
  @IsString() city: string;
  @IsString() address: string;
  @IsString() district: string;
  @IsString() dni: string;
  @IsString() birth_date: string;
  @IsOptional()
  @IsInt()
  @Max(100) // Limita el número máximo de elementos por página
  limit?: number = 10;
}
