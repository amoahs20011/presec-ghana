import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsInt,
  IsNumber,
  IsBoolean,
  Min,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EventType } from '../event.entity';

export class CreateEventDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(EventType)
  eventType?: EventType;

  @IsOptional()
  @IsUUID()
  schoolId?: string;

  @IsOptional()
  @IsUUID()
  yearGroupId?: string;

  @IsDateString()
  startDatetime: string;

  @IsOptional()
  @IsDateString()
  endDatetime?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  locationName?: string;

  @IsOptional()
  @IsString()
  locationAddress?: string;

  @IsOptional()
  @IsNumber()
  locationLat?: number;

  @IsOptional()
  @IsNumber()
  locationLng?: number;

  @IsOptional()
  @IsString()
  coverPhotoUrl?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxAttendees?: number;

  @IsOptional()
  @IsDateString()
  registrationDeadline?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  ticketPrice?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
