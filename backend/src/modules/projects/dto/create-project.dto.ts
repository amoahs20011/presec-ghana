import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsInt,
  IsBoolean,
  IsDateString,
  IsUUID,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ProjectStatus,
  ProjectCategory,
} from '../project.entity';

export class CreateProjectDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ProjectCategory)
  category?: ProjectCategory;

  @IsOptional()
  @IsUUID()
  schoolId?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  targetAmount: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  targetCompletionDate?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsString()
  coverPhotoUrl?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  progressPercentage?: number;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
