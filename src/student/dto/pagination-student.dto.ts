import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class PaginationStudentDto {
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  order?: 'desc' | 'asc' = 'desc';

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  term?: string;

  @IsOptional()
  @IsString()
  teacher?: string;

  @IsOptional()
  @IsString()
  district?: string;


  @IsOptional()
  @IsString()
  group?: string;

  @IsOptional()
  @IsString()
  teacherId?: string;
}