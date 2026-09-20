import {
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../contribution.entity';

export class CreateContributionDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  paymentReference?: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;
}
