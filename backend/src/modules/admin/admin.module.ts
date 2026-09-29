import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { User } from '../users/user.entity';
import { Event } from '../events/event.entity';
import { Project } from '../projects/project.entity';
import { Announcement } from '../announcements/announcement.entity';
import { Opportunity } from '../opportunities/opportunity.entity';
import { Business } from '../businesses/business.entity';
import { AlumniProfile } from '../alumni/alumni-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Event,
      Project,
      Announcement,
      Opportunity,
      Business,
      AlumniProfile,
    ]),
  ],
  controllers: [AdminController],
})
export class AdminModule {}
