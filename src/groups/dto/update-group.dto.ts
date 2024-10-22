import { IsString, IsOptional, IsDateString, IsArray, IsNumber, IsNotEmpty, IsMongoId, IsIn } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateGroupDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly level?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly group?: string;

  @IsOptional()
  @IsMongoId()
  readonly teacher_id?: Types.ObjectId;

  @IsOptional()
  @IsDateString()
  readonly start_date?: string;

  @IsOptional()
  @IsDateString()
  readonly end_date?: string;

  @IsOptional()
  @IsArray()
  readonly days?: string[];

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  readonly capacity?: number;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  readonly students?: Types.ObjectId[];
}
