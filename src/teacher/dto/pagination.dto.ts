import { IsOptional, IsString } from "class-validator";

export class PaginationTeacherDto {
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
  district?: string;


  @IsOptional()
  @IsString()
  group?: string;
}