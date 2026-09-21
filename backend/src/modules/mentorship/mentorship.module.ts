import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentorshipOffer } from './mentorship-offer.entity';
import { MentorshipRequest } from './mentorship-request.entity';
import { MentorshipService } from './mentorship.service';
import { MentorshipController } from './mentorship.controller';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MentorshipOffer, MentorshipRequest, User]),
  ],
  providers: [MentorshipService],
  controllers: [MentorshipController],
  exports: [MentorshipService],
})
export class MentorshipModule {}
