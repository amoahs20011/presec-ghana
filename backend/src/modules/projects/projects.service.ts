import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from './project.entity';
import {
  Contribution,
  ContributionStatus,
} from './contribution.entity';
import { ProjectUpdate } from './project-update.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { SearchProjectsDto } from './dto/search-projects.dto';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { CreateProjectUpdateDto } from './dto/create-project-update.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(Contribution)
    private readonly contribRepo: Repository<Contribution>,
    @InjectRepository(ProjectUpdate)
    private readonly updateRepo: Repository<ProjectUpdate>,
  ) {}

  // ==================== PROJECTS ====================

  async create(dto: CreateProjectDto, userId: string): Promise<Project> {
    const project = this.projectRepo.create({
      title: dto.title,
      description: dto.description || null,
      category: dto.category as any,
      schoolId: dto.schoolId || null,
      targetAmount: dto.targetAmount.toString(),
      currency: dto.currency || 'GHS',
      startDate: dto.startDate ? new Date(dto.startDate) : null,
      targetCompletionDate: dto.targetCompletionDate
        ? new Date(dto.targetCompletionDate)
        : null,
      status: dto.status || ProjectStatus.PLANNING,
      coverPhotoUrl: dto.coverPhotoUrl || null,
      progressPercentage: dto.progressPercentage || 0,
      isPublic: dto.isPublic ?? true,
      createdBy: userId,
    });
    return this.projectRepo.save(project);
  }

  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');

    if (dto.title !== undefined) project.title = dto.title;
    if (dto.description !== undefined) project.description = dto.description;
    if (dto.category !== undefined) project.category = dto.category;
    if (dto.schoolId !== undefined) project.schoolId = dto.schoolId;
    if (dto.targetAmount !== undefined)
      project.targetAmount = dto.targetAmount.toString();
    if (dto.currency !== undefined) project.currency = dto.currency;
    if (dto.startDate !== undefined)
      project.startDate = dto.startDate ? new Date(dto.startDate) : null;
    if (dto.targetCompletionDate !== undefined)
      project.targetCompletionDate = dto.targetCompletionDate
        ? new Date(dto.targetCompletionDate)
        : null;
    if (dto.status !== undefined) project.status = dto.status;
    if (dto.coverPhotoUrl !== undefined)
      project.coverPhotoUrl = dto.coverPhotoUrl;
    if (dto.progressPercentage !== undefined)
      project.progressPercentage = dto.progressPercentage;
    if (dto.isPublic !== undefined) project.isPublic = dto.isPublic;

    return this.projectRepo.save(project);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    await this.projectRepo.remove(project);
    return { deleted: true };
  }

  async search(dto: SearchProjectsDto) {
    const where: any = { isPublic: true };

    if (dto.status) where.status = dto.status;
    if (dto.category) where.category = dto.category;
    if (dto.schoolId) where.schoolId = dto.schoolId;
    if (dto.isPublic !== undefined) where.isPublic = dto.isPublic;

    const qb = this.projectRepo
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.school', 'school')
      .where(where);

    if (dto.q) {
      qb.andWhere(
        `(project.title ILIKE :q OR project.description ILIKE :q)`,
        { q: `%${dto.q}%` },
      );
    }

    qb.orderBy('project.createdAt', 'DESC')
      .take(dto.limit || 20)
      .skip(dto.offset || 0);

    const [items, total] = await qb.getManyAndCount();

    // Attach computed progress percentage based on raised/target
    const enriched = items.map((p) => this.withComputedProgress(p));

    return {
      items: enriched,
      total,
      limit: dto.limit || 20,
      offset: dto.offset || 0,
    };
  }

  async findOne(id: string) {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');

    const contribCount = await this.contribRepo.count({
      where: { projectId: id, status: ContributionStatus.CONFIRMED },
    });

    return {
      ...this.withComputedProgress(project),
      contributorCount: contribCount,
    };
  }

  // ==================== CONTRIBUTIONS ====================

  async contribute(
    projectId: string,
    userId: string,
    dto: CreateContributionDto,
  ): Promise<Contribution> {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
    });
    if (!project) throw new NotFoundException('Project not found');

    if (project.status === ProjectStatus.COMPLETED) {
      throw new BadRequestException(
        'This project is already completed and no longer accepts contributions',
      );
    }

    const contribution = this.contribRepo.create({
      projectId,
      userId,
      amount: dto.amount.toString(),
      currency: dto.currency || 'GHS',
      paymentMethod: dto.paymentMethod || null,
      paymentReference: dto.paymentReference || null,
      isAnonymous: dto.isAnonymous || false,
      message: dto.message || null,
      status: ContributionStatus.PENDING,
    });

    return this.contribRepo.save(contribution);
  }

  async confirmContribution(
    id: string,
    adminId: string,
  ): Promise<Contribution> {
    const contribution = await this.contribRepo.findOne({ where: { id } });
    if (!contribution) {
      throw new NotFoundException('Contribution not found');
    }

    if (contribution.status === ContributionStatus.CONFIRMED) {
      return contribution;
    }

    contribution.status = ContributionStatus.CONFIRMED;
    contribution.confirmedBy = adminId;
    contribution.confirmedAt = new Date();
    await this.contribRepo.save(contribution);

    // Update project raised amount
    await this.recalculateProjectRaised(contribution.projectId);

    return contribution;
  }

  async listContributions(projectId: string, onlyConfirmed = true) {
    const where: any = { projectId };
    if (onlyConfirmed) where.status = ContributionStatus.CONFIRMED;

    const contributions = await this.contribRepo.find({
      where,
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });

    // Sanitize anonymous contributions
    return contributions.map((c) => {
      const safe: any = { ...c };
      if (safe.isAnonymous && safe.user) {
        safe.user = {
          id: null,
          firstName: 'Anonymous',
          lastName: '',
          email: null,
        };
      } else if (safe.user) {
        delete safe.user.passwordHash;
      }
      return safe;
    });
  }

  async myContributions(userId: string) {
    return this.contribRepo.find({
      where: { userId },
      relations: { project: true },
      order: { createdAt: 'DESC' },
    });
  }

  // ==================== UPDATES ====================

  async addUpdate(
    projectId: string,
    dto: CreateProjectUpdateDto,
    userId: string,
  ): Promise<ProjectUpdate> {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
    });
    if (!project) throw new NotFoundException('Project not found');

    const update = this.updateRepo.create({
      projectId,
      title: dto.title || null,
      content: dto.content || null,
      photoUrls: dto.photoUrls || null,
      progressPercentage: dto.progressPercentage ?? null,
      createdBy: userId,
    });
    const saved = await this.updateRepo.save(update);

    // Sync progress on project if provided
    if (dto.progressPercentage !== undefined) {
      project.progressPercentage = dto.progressPercentage;
      await this.projectRepo.save(project);
    }

    return saved;
  }

  async listUpdates(projectId: string) {
    return this.updateRepo.find({
      where: { projectId },
      relations: { creator: true },
      order: { createdAt: 'DESC' },
    });
  }

  // ==================== HELPERS ====================

  private async recalculateProjectRaised(projectId: string) {
    const result = await this.contribRepo
      .createQueryBuilder('c')
      .select('COALESCE(SUM(c.amount), 0)', 'sum')
      .where('c.project_id = :projectId', { projectId })
      .andWhere('c.status = :status', {
        status: ContributionStatus.CONFIRMED,
      })
      .getRawOne();

    const raised = parseFloat(result?.sum || '0').toFixed(2);

    await this.projectRepo.update(projectId, { raisedAmount: raised });
  }

  private withComputedProgress(project: Project) {
    const target = Number(project.targetAmount);
    const raised = Number(project.raisedAmount);
    const computed = target > 0 ? Math.min(100, (raised / target) * 100) : 0;
    return {
      ...project,
      computedProgress: Math.round(computed * 100) / 100,
    };
  }
}
