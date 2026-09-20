import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsUUID,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { HeritageType } from '../heritage-item.entity';

export class CreateHeritageItemDto {
  @IsOptional()
  @IsUUID()
  schoolId?: string;

  @IsOptional()
  @IsEnum(HeritageType)
  type?: HeritageType;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1800)
  @Max(2100)
  yearEstimate?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  source?: string;
}
