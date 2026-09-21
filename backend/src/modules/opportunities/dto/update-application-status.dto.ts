import { IsEnum } from 'class-validator';
import { ApplicationStatus } from '../opportunity-application.entity';

export class UpdateApplicationStatusDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}
