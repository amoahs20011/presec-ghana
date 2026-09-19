import { IsEnum } from 'class-validator';
import { VerificationStatus } from '../alumni-profile.entity';

export class VerifyAlumniDto {
  @IsEnum(VerificationStatus)
  status: VerificationStatus;
}
