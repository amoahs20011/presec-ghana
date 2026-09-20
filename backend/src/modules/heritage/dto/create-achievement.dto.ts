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
import { AchievementType } from '../achievement.entity';

export class CreateAchievementDto {
  @IsOptional()
  @IsUUID()
  schoolId?: string;

  @IsOptional()
  @IsEnum(AchievementType)
  type?: AchievementType;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1800)
  @Max(2100)
  year?: number;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}
