import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { YearGroup } from './year-group.entity';

@Injectable()
export class YearGroupsService {
  constructor(
    @InjectRepository(YearGroup)
    private readonly repo: Repository<YearGroup>,
  ) {}

  async findAll(): Promise<YearGroup[]> {
    return this.repo.find({ order: { graduationYear: 'DESC' } });
  }

  async findBySchool(schoolId: string): Promise<YearGroup[]> {
    return this.repo.find({
      where: { schoolId },
      order: { graduationYear: 'DESC' },
    });
  }

  async findOne(id: string): Promise<YearGroup | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findOrCreate(
    schoolId: string,
    graduationYear: number,
  ): Promise<YearGroup> {
    let existing = await this.repo.findOne({
      where: { schoolId, graduationYear },
    });
    if (!existing) {
      existing = this.repo.create({
        schoolId,
        graduationYear,
        name: `${graduationYear} Year Group`,
      });
      existing = await this.repo.save(existing);
    }
    return existing;
  }
}
