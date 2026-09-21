import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { SearchOpportunitiesDto } from './dto/search-opportunities.dto';
import { ApplyOpportunityDto } from './dto/apply-opportunity.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/decorators/current-user.decorator';

@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly service: OpportunitiesService) {}

  // ---------- PUBLIC ----------

  @Public()
  @Get()
  async search(@Query() dto: SearchOpportunitiesDto) {
    return this.service.search(dto);
  }

  // Specific static routes BEFORE :id
  @Get('me/applications')
  async myApplications(@CurrentUser() user: AuthUser) {
    return this.service.myApplications(user.id);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ---------- AUTHENTICATED ----------

  @Post(':id/apply')
  async apply(
    @Param('id') opportunityId: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: ApplyOpportunityDto,
  ) {
    return this.service.apply(opportunityId, user.id, dto);
  }

  // ---------- ADMIN ----------

  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN, UserRole.SCHOOL_ADMIN)
  @Post()
  async create(
    @Body() dto: CreateOpportunityDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.create(dto, user.id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN, UserRole.SCHOOL_ADMIN)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateOpportunityDto) {
    return this.service.update(id, dto);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN, UserRole.SCHOOL_ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN, UserRole.SCHOOL_ADMIN)
  @Get(':id/applications')
  async listApplications(@Param('id') id: string) {
    return this.service.listApplications(id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN, UserRole.SCHOOL_ADMIN)
  @Patch('applications/:id/status')
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.service.updateApplicationStatus(id, dto.status);
  }
}
