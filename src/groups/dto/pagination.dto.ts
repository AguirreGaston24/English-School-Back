import { IsOptional, IsString, IsIn, IsNumber } from 'class-validator';

export class PaginationGroupDto {
  @IsOptional()
  @IsNumber()
  readonly page?: number = 1;

  @IsOptional()
  @IsNumber()
  readonly limit?: number = 10;

  @IsOptional()
  @IsString()
  @IsIn(['desc', 'asc'])
  readonly order?: 'desc' | 'asc' = 'desc';

  @IsOptional()
  @IsString()
  readonly sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  readonly group?: string;

  @IsOptional()
  @IsString()
  readonly level?: string;

  @IsOptional()
  @IsString()
  readonly teacher?: string;
}
