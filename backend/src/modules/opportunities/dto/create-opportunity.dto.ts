import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { OpportunityType, JobType } from '../opportunity.entity';

export class CreateOpportunityDto {
  @IsOptional()
  @IsEnum(OpportunityType)
  type?: OpportunityType;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  companyName?: string;

  @IsOptional()
  @IsString()
  companyLogoUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry?: string;

  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  experienceLevel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  qualification?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  salaryRange?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  applicationUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  contactEmail?: string;

  @IsOptional()
  @IsUUID()
  schoolId?: string;
}
