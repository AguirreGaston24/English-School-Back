import { IsString, IsOptional, IsDateString, IsArray, IsNumber, IsNotEmpty, IsMongoId, IsIn } from 'class-validator';
import { Types } from 'mongoose';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  level: string;

  @IsString()
  @IsNotEmpty()
  group: string;

  @IsOptional()
  @IsMongoId()
  teacher_id?: Types.ObjectId;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsArray()
  @IsNotEmpty()
  @IsIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], { each: true })
  days: string[];

  @IsNumber()
  @IsNotEmpty()
  capacity: number;

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  students?: Types.ObjectId[];
}
