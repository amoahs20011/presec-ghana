import { IsOptional, IsString, IsInt, IsBoolean, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchAlumniDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  schoolId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1950)
  @Max(2100)
  graduationYear?: number;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  locationCity?: string;

  @IsOptional()
  @IsString()
  locationCountry?: string;

  @IsOptional()
  @IsString()
  programme?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isAvailableForMentorship?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}
