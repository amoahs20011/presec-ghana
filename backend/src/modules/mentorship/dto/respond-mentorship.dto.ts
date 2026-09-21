import { IsEnum } from 'class-validator';
import { MentorshipRequestStatus } from '../mentorship-request.entity';

export class RespondMentorshipDto {
  @IsEnum(MentorshipRequestStatus)
  status: MentorshipRequestStatus;
}
