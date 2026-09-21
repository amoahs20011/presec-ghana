import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ApplyOpportunityDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  coverNote?: string;
}
