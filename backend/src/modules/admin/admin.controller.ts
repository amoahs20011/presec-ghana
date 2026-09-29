import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Event } from '../events/event.entity';
import { Project } from '../projects/project.entity';
import { Announcement } from '../announcements/announcement.entity';
import { Opportunity } from '../opportunities/opportunity.entity';
import { Business } from '../businesses/business.entity';
import { AlumniProfile } from '../alumni/alumni-profile.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('admin')
export class AdminController {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Event) private eventRepo: Repository<Event>,
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    @InjectRepository(Announcement)
    private announcementRepo: Repository<Announcement>,
    @InjectRepository(Opportunity)
    private opportunityRepo: Repository<Opportunity>,
    @InjectRepository(Business) private businessRepo: Repository<Business>,
    @InjectRepository(AlumniProfile)
    private alumniRepo: Repository<AlumniProfile>,
  ) {}

  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @Get('stats')
  async getStats() {
    const [
      users,
      events,
      projects,
      announcements,
      opportunities,
      businesses,
      pendingAlumni,
    ] = await Promise.all([
      this.userRepo.count(),
      this.eventRepo.count(),
      this.projectRepo.count(),
      this.announcementRepo.count(),
      this.opportunityRepo.count(),
      this.businessRepo.count(),
      this.alumniRepo.count({ where: { verificationStatus: 'pending' } }),
    ]);

    return {
      users,
      events,
      projects,
      announcements,
      opportunities,
      businesses,
      pendingAlumni,
    };
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @Get('pending-alumni')
  async getPendingAlumni() {
    return this.alumniRepo.find({
      where: { verificationStatus: 'pending' },
      relations: ['user', 'school'],
      take: 20,
    });
  }
}
