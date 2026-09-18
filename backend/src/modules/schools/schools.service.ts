import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from './school.entity';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
  ) {}

  async findAll(): Promise<School[]> {
    return this.schoolRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<School | null> {
    return this.schoolRepository.findOne({ where: { id } });
  }
}
