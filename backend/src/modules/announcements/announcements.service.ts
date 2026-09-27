import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { SearchAnnouncementsDto } from './dto/search-announcements.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private readonly repo: Repository<Announcement>,
  ) {}

  async create(dto: CreateAnnouncementDto, userId: string): Promise<Announcement> {
    const announcement = this.repo.create({
      schoolId: dto.schoolId || null,
      type: dto.type as any,
      title: dto.title,
      content: dto.content || null,
      photoUrl: dto.photoUrl || null,
      isPublic: dto.isPublic ?? true,
      isPinned: dto.isPinned ?? false,
      publishedBy: userId,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
    });
    return this.repo.save(announcement);
  }

  async update(id: string, dto: UpdateAnnouncementDto): Promise<Announcement> {
    const announcement = await this.repo.findOne({ where: { id } });
    if (!announcement) throw new NotFoundException('Announcement not found');

    Object.assign(announcement, {
      ...dto,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : announcement.expiresAt,
    });
    return this.repo.save(announcement);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    const announcement = await this.repo.findOne({ where: { id } });
    if (!announcement) throw new NotFoundException('Announcement not found');
    await this.repo.remove(announcement);
    return { deleted: true };
  }

  async search(dto: SearchAnnouncementsDto) {
    const qb = this.repo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.school', 'school');

    if (dto.isPublic !== undefined) {
      qb.andWhere('a.isPublic = :isPublic', { isPublic: dto.isPublic });
    } else {
      qb.andWhere('a.isPublic = :isPublic', { isPublic: true });
    }

    if (dto.type) {
      qb.andWhere('a.type = :type', { type: dto.type });
    }
    if (dto.schoolId) {
      qb.andWhere('a.schoolId = :schoolId', { schoolId: dto.schoolId });
    }
    if (dto.isPinned !== undefined) {
      qb.andWhere('a.isPinned = :isPinned', { isPinned: dto.isPinned });
    }

    if (dto.q) {
      qb.andWhere('(a.title ILIKE :q OR a.content ILIKE :q)', {
        q: `%${dto.q}%`,
      });
    }

    qb.orderBy('a.isPinned', 'DESC')
      .addOrderBy('a.publishedAt', 'DESC')
      .take(dto.limit || 20)
      .skip(dto.offset || 0);

    const [items, total] = await qb.getManyAndCount();
    return {
      items: items.map((a) => this.sanitize(a)),
      total,
      limit: dto.limit || 20,
      offset: dto.offset || 0,
    };
  }

  async findOne(id: string) {
    const a = await this.repo.findOne({ where: { id } });
    if (!a) throw new NotFoundException('Announcement not found');
    return this.sanitize(a);
  }

  private sanitize(a: Announcement) {
    return { ...a };
  }
}
