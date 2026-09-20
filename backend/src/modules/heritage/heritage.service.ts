import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HeritageItem } from './heritage-item.entity';
import { Achievement } from './achievement.entity';
import { CreateHeritageItemDto } from './dto/create-heritage-item.dto';
import { CreateAchievementDto } from './dto/create-achievement.dto';

@Injectable()
export class HeritageService {
  constructor(
    @InjectRepository(HeritageItem)
    private readonly heritageRepo: Repository<HeritageItem>,
    @InjectRepository(Achievement)
    private readonly achievementRepo: Repository<Achievement>,
  ) {}

  // ---------- HERITAGE ----------
  async createItem(dto: CreateHeritageItemDto, userId: string): Promise<HeritageItem> {
    const item = this.heritageRepo.create({
      schoolId: dto.schoolId || null,
      type: dto.type as any,
      title: dto.title,
      description: dto.description || null,
      fileUrl: dto.fileUrl || null,
      thumbnailUrl: dto.thumbnailUrl || null,
      yearEstimate: dto.yearEstimate || null,
      source: dto.source || null,
      contributorId: userId,
      isApproved: false,
    });
    return this.heritageRepo.save(item);
  }

  async approveItem(id: string, adminId: string): Promise<HeritageItem> {
    const item = await this.heritageRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Heritage item not found');
    item.isApproved = true;
    item.approvedBy = adminId;
    return this.heritageRepo.save(item);
  }

  async listItems(approvedOnly = true) {
    const where: any = {};
    if (approvedOnly) where.isApproved = true;
    const items = await this.heritageRepo.find({
      where,
      relations: { school: true, contributor: true },
      order: { yearEstimate: 'ASC', createdAt: 'DESC' },
    });
    return items.map((i) => this.sanitizeContributor(i));
  }

  async findItem(id: string) {
    const item = await this.heritageRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Heritage item not found');
    return this.sanitizeContributor(item);
  }

  async removeItem(id: string) {
    const item = await this.heritageRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Heritage item not found');
    await this.heritageRepo.remove(item);
    return { deleted: true };
  }

  // ---------- ACHIEVEMENTS ----------
  async createAchievement(dto: CreateAchievementDto): Promise<Achievement> {
    const a = this.achievementRepo.create({
      schoolId: dto.schoolId || null,
      type: dto.type as any,
      title: dto.title,
      description: dto.description || null,
      year: dto.year || null,
      photoUrl: dto.photoUrl || null,
    });
    return this.achievementRepo.save(a);
  }

  async listAchievements() {
    return this.achievementRepo.find({
      relations: { school: true },
      order: { year: 'DESC', createdAt: 'DESC' },
    });
  }

  async removeAchievement(id: string) {
    const a = await this.achievementRepo.findOne({ where: { id } });
    if (!a) throw new NotFoundException('Achievement not found');
    await this.achievementRepo.remove(a);
    return { deleted: true };
  }

  private sanitizeContributor(item: any) {
    const safe: any = { ...item };
    if (safe.contributor) delete safe.contributor.passwordHash;
    return safe;
  }
}
