import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  @IsString({ message: 'El correo electrónico debe ser una cadena de caracteres' })
  email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de caracteres' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(50, { message: 'La contraseña no puede tener más de 50 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
    message: 'La contraseña debe contener al menos una letra minúscula, una letra mayúscula y un número',
  })
  password: string;

  @IsString({ message: 'El nombre de usuario debe ser una cadena de caracteres' })
  username: string;

  // @IsString({ message: 'El número de teléfono debe ser una cadena de caracteres' })
  // phone: string;
}
