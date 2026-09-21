import {
  IsString,
  IsOptional,
  IsInt,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMentorshipOfferDto {
  @IsString()
  @MaxLength(255)
  area: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  maxMentees?: number;
}
