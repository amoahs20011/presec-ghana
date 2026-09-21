import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RequestMentorshipDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string;
}
