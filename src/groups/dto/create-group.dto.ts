import { IsString, IsOptional, IsDateString, IsArray, IsNumber, IsNotEmpty, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly level: string;

  @IsString()
  @IsNotEmpty()
  readonly group: string;

  @IsOptional()
  @IsMongoId()
  readonly teacher_id?: Types.ObjectId;

  @IsDateString()
  @IsNotEmpty()
  readonly start_date: string;

  @IsDateString()
  @IsNotEmpty()
  readonly end_date: string;

  @IsArray()
  @IsNotEmpty()
  readonly days: string[];

  @IsNumber()
  @IsNotEmpty()
  readonly capacity: number;

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  readonly students?: Types.ObjectId[];
}
