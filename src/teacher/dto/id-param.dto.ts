import { IsMongoId } from 'class-validator';

export class IdParamDto {
  @IsMongoId({ message: 'El ID debe ser un ObjectId válido' })
  id: string;
}