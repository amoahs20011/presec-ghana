import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import {
  AlumniProfile,
  VerificationStatus,
} from './alumni-profile.entity';
import { UpsertAlumniProfileDto } from './dto/upsert-alumni-profile.dto';
import { SearchAlumniDto } from './dto/search-alumni.dto';
import { YearGroupsService } from '../year-groups/year-groups.service';
import { UserRole } from '../users/user.entity';

@Injectable()
export class AlumniService {
  constructor(
    @InjectRepository(AlumniProfile)
    private readonly repo: Repository<AlumniProfile>,
    private readonly yearGroupsService: YearGroupsService,
  ) {}

  async getMyProfile(userId: string): Promise<AlumniProfile> {
    const profile = await this.repo.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException(
        'Alumni profile not found. Please create one.',
      );
    }
    return profile;
  }

  async upsertMyProfile(
    userId: string,
    dto: UpsertAlumniProfileDto,
  ): Promise<AlumniProfile> {
    let profile = await this.repo.findOne({ where: { userId } });

    let yearGroupId: string | null = null;
    if (dto.schoolId && dto.graduationYear) {
      const yg = await this.yearGroupsService.findOrCreate(
        dto.schoolId,
        dto.graduationYear,
      );
      yearGroupId = yg.id;
    }

    if (!profile) {
      profile = this.repo.create({
        userId,
        ...dto,
        yearGroupId,
      });
    } else {
      Object.assign(profile, dto);
      if (yearGroupId) profile.yearGroupId = yearGroupId;
    }

    return this.repo.save(profile);
  }

  async findPublicProfile(id: string, viewerRole?: UserRole) {
    const profile = await this.repo.findOne({
      where: { id },
      relations: { user: true, school: true, yearGroup: true },
    });

    if (!profile) {
      throw new NotFoundException('Alumni profile not found');
    }

    if (!profile.isPublic && viewerRole !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('This profile is private');
    }

    return this.sanitizeProfile(profile);
  }

  async search(dto: SearchAlumniDto) {
    const where: any = {
      isPublic: true,
      verificationStatus: VerificationStatus.VERIFIED,
    };

    if (dto.schoolId) where.schoolId = dto.schoolId;
    if (dto.graduationYear) where.graduationYear = dto.graduationYear;
    if (dto.industry) where.industry = ILike(`%${dto.industry}%`);
    if (dto.locationCity) where.locationCity = ILike(`%${dto.locationCity}%`);
    if (dto.locationCountry)
      where.locationCountry = ILike(`%${dto.locationCountry}%`);
    if (dto.programme) where.programme = ILike(`%${dto.programme}%`);
    if (dto.isAvailableForMentorship !== undefined) {
      where.isAvailableForMentorship = dto.isAvailableForMentorship;
    }

    const qb = this.repo
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .leftJoinAndSelect('profile.school', 'school')
      .leftJoinAndSelect('profile.yearGroup', 'yearGroup')
      .where(where);

    if (dto.q) {
      qb.andWhere(
        `(user.first_name ILIKE :q OR user.last_name ILIKE :q OR profile.current_profession ILIKE :q OR profile.current_employer ILIKE :q)`,
        { q: `%${dto.q}%` },
      );
    }

    qb.orderBy('user.first_name', 'ASC')
      .take(dto.limit || 20)
      .skip(dto.offset || 0);

    const [items, total] = await qb.getManyAndCount();

    return {
      items: items.map((p) => this.sanitizeProfile(p)),
      total,
      limit: dto.limit || 20,
      offset: dto.offset || 0,
    };
  }

  async verify(
    id: string,
    status: VerificationStatus,
    adminId: string,
  ): Promise<AlumniProfile> {
    const profile = await this.repo.findOne({ where: { id } });
    if (!profile) {
      throw new NotFoundException('Alumni profile not found');
    }

    profile.verificationStatus = status;
    profile.verifiedBy = adminId;
    profile.verifiedAt = new Date();

    return this.repo.save(profile);
  }

  async listPending(): Promise<AlumniProfile[]> {
    return this.repo.find({
      where: { verificationStatus: VerificationStatus.PENDING },
      relations: { user: true, school: true },
      order: { createdAt: 'ASC' },
    });
  }

  private sanitizeProfile(profile: AlumniProfile) {
    const safe: any = { ...profile };
    if (safe.user) {
      delete safe.user.passwordHash;
    }
    return safe;
  }
}
