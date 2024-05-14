import { IsNotEmpty, IsString, IsDateString, IsIn } from 'class-validator';

export class CreateAssistDto {
  @IsNotEmpty() @IsString() student_id: string;
  // @IsNotEmpty() @IsString() course_id: string;
  @IsNotEmpty() @IsDateString() date: Date;
  @IsNotEmpty() @IsString() @IsIn(['presente', 'ausente', 'tardío']) status: string;
}