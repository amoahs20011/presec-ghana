import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Business } from './business.entity';
import { CreateBusinessDto } from './dto/create-business.dto';
import { SearchBusinessesDto } from './dto/search-businesses.dto';
import { UserRole } from '../users/user.entity';

@Injectable()
export class BusinessesService {
  constructor(
    @InjectRepository(Business)
    private readonly repo: Repository<Business>,
  ) {}

  async create(dto: CreateBusinessDto, userId: string): Promise<Business> {
    const business = this.repo.create({
      ownerId: userId,
      name: dto.name,
      description: dto.description || null,
      industry: dto.industry || null,
      location: dto.location || null,
      website: dto.website || null,
      phone: dto.phone || null,
      email: dto.email || null,
      logoUrl: dto.logoUrl || null,
      isVerified: false,
      isActive: true,
    });
    return this.sanitize(await this.repo.save(business));
  }

  async update(
    id: string,
    dto: Partial<CreateBusinessDto>,
    userId: string,
    role: UserRole,
  ): Promise<Business> {
    const business = await this.repo.findOne({ where: { id } });
    if (!business) throw new NotFoundException('Business not found');

    const isAdmin =
      role === UserRole.SUPER_ADMIN ||
      role === UserRole.ALUMNI_ADMIN ||
      role === UserRole.SCHOOL_ADMIN;

    if (business.ownerId !== userId && !isAdmin) {
      throw new ForbiddenException('You can only edit your own business');
    }

    Object.assign(business, dto);
    return this.sanitize(await this.repo.save(business));
  }

  async remove(id: string, userId: string, role: UserRole) {
    const business = await this.repo.findOne({ where: { id } });
    if (!business) throw new NotFoundException('Business not found');

    const isAdmin =
      role === UserRole.SUPER_ADMIN ||
      role === UserRole.ALUMNI_ADMIN ||
      role === UserRole.SCHOOL_ADMIN;

    if (business.ownerId !== userId && !isAdmin) {
      throw new ForbiddenException('You can only delete your own business');
    }

    await this.repo.remove(business);
    return { deleted: true };
  }

  async verify(id: string): Promise<Business> {
    const business = await this.repo.findOne({ where: { id } });
    if (!business) throw new NotFoundException('Business not found');
    business.isVerified = true;
    return this.sanitize(await this.repo.save(business));
  }

  async search(dto: SearchBusinessesDto) {
    const where: any = { isActive: true };

    if (dto.industry) where.industry = ILike(`%${dto.industry}%`);
    if (dto.location) where.location = ILike(`%${dto.location}%`);
    if (dto.isVerified !== undefined) where.isVerified = dto.isVerified;

    const qb = this.repo
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.owner', 'owner')
      .where(where);

    if (dto.q) {
      qb.andWhere(
        `(b.name ILIKE :q OR b.description ILIKE :q)`,
        { q: `%${dto.q}%` },
      );
    }

    qb.orderBy('b.createdAt', 'DESC')
      .take(dto.limit || 20)
      .skip(dto.offset || 0);

    const [items, total] = await qb.getManyAndCount();

    return {
      items: items.map((b) => this.sanitize(b)),
      total,
      limit: dto.limit || 20,
      offset: dto.offset || 0,
    };
  }

  async findOne(id: string) {
    const business = await this.repo.findOne({ where: { id } });
    if (!business) throw new NotFoundException('Business not found');
    return this.sanitize(business);
  }

  async myBusinesses(userId: string) {
    const items = await this.repo.find({
      where: { ownerId: userId },
      order: { createdAt: 'DESC' },
    });
    return items.map((b) => this.sanitize(b));
  }

  private sanitize(b: Business) {
    const safe: any = { ...b };
    if (safe.owner) delete safe.owner.passwordHash;
    return safe;
  }
}
