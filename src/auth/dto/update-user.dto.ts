import { IsEmail, IsIn, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {
  @IsEmail()
  @IsString({ message: 'El correo electrónico debe ser una cadena de caracteres' })
  @IsOptional()
  email: string;

  @IsString({ message: 'El nombre de usuario debe ser una cadena de caracteres' })
  @IsOptional()
  username: string;

  @IsString({ message: 'El numero de telefono debe ser una cadena de caracteres' })
  @IsOptional()
  phone: string;

  @IsOptional()
  @IsIn(['admin', 'client'])
  role: string;

}