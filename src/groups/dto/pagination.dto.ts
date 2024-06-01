import { IsOptional, IsString } from "class-validator";

export class PaginationGroupDto {
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
  level?: string;

  @IsOptional()
  @IsString()
  teacher?: string;
}