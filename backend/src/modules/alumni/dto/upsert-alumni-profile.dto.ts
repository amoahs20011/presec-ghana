import { IsOptional, IsString } from 'class-validator';

import {
  IsOptional,
  IsString,
  IsInt,
  IsBoolean,
  IsArray,
  IsUrl,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class UpsertAlumniProfileDto {
  @IsOptional()
  @IsString()
  schoolId?: string;

  @IsOptional()
  @IsString()
  profilePhotoUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(1950)
  @Max(2100)
  graduationYear?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  programme?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  currentProfession?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  currentEmployer?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  locationCountry?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  locationCity?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;

  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;

  @IsOptional()
  @IsUrl()
  websiteUrl?: string;

  @IsOptional()
  @IsBoolean()
  isAvailableForMentorship?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mentorshipAreas?: string[];

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
