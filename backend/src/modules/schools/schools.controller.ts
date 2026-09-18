import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Public()
  @Get()
  async findAll() {
    return this.schoolsService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const school = await this.schoolsService.findOne(id);
    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return school;
  }
}
