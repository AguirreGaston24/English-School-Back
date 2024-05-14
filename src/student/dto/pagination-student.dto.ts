import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class PaginationStudentDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
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
}