import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, MoreThanOrEqual, IsNull, Or } from 'typeorm';
import { Opportunity } from './opportunity.entity';
import {
  OpportunityApplication,
  ApplicationStatus,
} from './opportunity-application.entity';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { SearchOpportunitiesDto } from './dto/search-opportunities.dto';
import { ApplyOpportunityDto } from './dto/apply-opportunity.dto';

@Injectable()
export class OpportunitiesService {
  constructor(
    @InjectRepository(Opportunity)
    private readonly oppRepo: Repository<Opportunity>,
    @InjectRepository(OpportunityApplication)
    private readonly appRepo: Repository<OpportunityApplication>,
  ) {}

  async create(dto: CreateOpportunityDto, userId: string): Promise<Opportunity> {
    const opp = this.oppRepo.create({
      type: dto.type as any,
      title: dto.title,
      description: dto.description || null,
      companyName: dto.companyName || null,
      companyLogoUrl: dto.companyLogoUrl || null,
      location: dto.location || null,
      industry: dto.industry || null,
      jobType: dto.jobType || null,
      experienceLevel: dto.experienceLevel || null,
      qualification: dto.qualification || null,
      salaryRange: dto.salaryRange || null,
      deadline: dto.deadline ? new Date(dto.deadline) : null,
      applicationUrl: dto.applicationUrl || null,
      contactEmail: dto.contactEmail || null,
      schoolId: dto.schoolId || null,
      postedBy: userId,
      isActive: true,
    });
    return this.oppRepo.save(opp);
  }

  async update(id: string, dto: UpdateOpportunityDto): Promise<Opportunity> {
    const opp = await this.oppRepo.findOne({ where: { id } });
    if (!opp) throw new NotFoundException('Opportunity not found');

    Object.assign(opp, {
      ...dto,
      deadline: dto.deadline ? new Date(dto.deadline) : opp.deadline,
    });
    return this.oppRepo.save(opp);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    const opp = await this.oppRepo.findOne({ where: { id } });
    if (!opp) throw new NotFoundException('Opportunity not found');
    await this.oppRepo.remove(opp);
    return { deleted: true };
  }

  async search(dto: SearchOpportunitiesDto) {
    const where: any = { isActive: true };

    if (dto.type) where.type = dto.type;
    if (dto.jobType) where.jobType = dto.jobType;
    if (dto.schoolId) where.schoolId = dto.schoolId;
    if (dto.isActive !== undefined) where.isActive = dto.isActive;
    if (dto.industry) where.industry = ILike(`%${dto.industry}%`);
    if (dto.location) where.location = ILike(`%${dto.location}%`);

    const qb = this.oppRepo
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.school', 'school')
      .where(where);

    if (dto.q) {
      qb.andWhere(
        `(o.title ILIKE :q OR o.description ILIKE :q OR o.company_name ILIKE :q)`,
        { q: `%${dto.q}%` },
      );
    }

    qb.orderBy('o.createdAt', 'DESC')
      .take(dto.limit || 20)
      .skip(dto.offset || 0);

    const [items, total] = await qb.getManyAndCount();
    return {
      items: items.map((o) => this.sanitizePoster(o)),
      total,
      limit: dto.limit || 20,
      offset: dto.offset || 0,
    };
  }

  async findOne(id: string) {
    const opp = await this.oppRepo.findOne({ where: { id } });
    if (!opp) throw new NotFoundException('Opportunity not found');
    const applicationCount = await this.appRepo.count({
      where: { opportunityId: id },
    });
    return { ...this.sanitizePoster(opp), applicationCount };
  }

  // -------- APPLICATIONS --------

  async apply(
    opportunityId: string,
    userId: string,
    dto: ApplyOpportunityDto,
  ): Promise<OpportunityApplication> {
    const opp = await this.oppRepo.findOne({ where: { id: opportunityId } });
    if (!opp) throw new NotFoundException('Opportunity not found');
    if (!opp.isActive) {
      throw new ConflictException('Opportunity is no longer active');
    }

    const existing = await this.appRepo.findOne({
      where: { opportunityId, userId },
    });
    if (existing) {
      throw new ConflictException('You have already applied to this opportunity');
    }

    const app = this.appRepo.create({
      opportunityId,
      userId,
      coverNote: dto.coverNote || null,
      status: ApplicationStatus.PENDING,
    });
    return this.appRepo.save(app);
  }

  async myApplications(userId: string) {
    return this.appRepo.find({
      where: { userId },
      relations: { opportunity: true },
      order: { appliedAt: 'DESC' },
    });
  }

  async listApplications(opportunityId: string) {
    const opp = await this.oppRepo.findOne({ where: { id: opportunityId } });
    if (!opp) throw new NotFoundException('Opportunity not found');

    const applications = await this.appRepo.find({
      where: { opportunityId },
      relations: { user: true },
      order: { appliedAt: 'ASC' },
    });

    return {
      opportunity: { id: opp.id, title: opp.title },
      applications: applications.map((a) => this.sanitizeApplication(a)),
      total: applications.length,
    };
  }

  async updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
  ): Promise<OpportunityApplication> {
    const app = await this.appRepo.findOne({ where: { id: applicationId } });
    if (!app) throw new NotFoundException('Application not found');
    app.status = status;
    return this.appRepo.save(app);
  }

  // -------- HELPERS --------

  private sanitizePoster(opp: Opportunity) {
    const safe: any = { ...opp };
    if (safe.poster) delete safe.poster.passwordHash;
    return safe;
  }

  private sanitizeApplication(app: OpportunityApplication) {
    const safe: any = { ...app };
    if (safe.user) delete safe.user.passwordHash;
    return safe;
  }
}
