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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { SearchProjectsDto } from './dto/search-projects.dto';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { CreateProjectUpdateDto } from './dto/create-project-update.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/decorators/current-user.decorator';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // ==================== PUBLIC ====================

  @Public()
  @Get()
  async search(@Query() dto: SearchProjectsDto) {
    return this.projectsService.search(dto);
  }

  // NOTE: /me/contributions MUST come before /:id routes
  // or else NestJS treats "me" as a UUID

  // ==================== AUTHENTICATED (specific routes first) ====================

  @Get('me/contributions')
  async myContributions(@CurrentUser() user: AuthUser) {
    return this.projectsService.myContributions(user.id);
  }

  // ==================== ADMIN (specific routes) ====================

  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN, UserRole.SCHOOL_ADMIN)
  @Post()
  async create(
    @Body() dto: CreateProjectDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.projectsService.create(dto, user.id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN, UserRole.SCHOOL_ADMIN)
  @Patch('contributions/:id/confirm')
  async confirmContribution(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.projectsService.confirmContribution(id, user.id);
  }

  // ==================== DYNAMIC :id ROUTES (must come last) ====================

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Public()
  @Get(':id/contributions')
  async listContributions(@Param('id') id: string) {
    return this.projectsService.listContributions(id);
  }

  @Public()
  @Get(':id/updates')
  async listUpdates(@Param('id') id: string) {
    return this.projectsService.listUpdates(id);
  }

  @Post(':id/contribute')
  async contribute(
    @Param('id') projectId: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateContributionDto,
  ) {
    return this.projectsService.contribute(projectId, user.id, dto);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN, UserRole.SCHOOL_ADMIN)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN, UserRole.SCHOOL_ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN, UserRole.SCHOOL_ADMIN)
  @Post(':id/updates')
  async addUpdate(
    @Param('id') projectId: string,
    @Body() dto: CreateProjectUpdateDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.projectsService.addUpdate(projectId, dto, user.id);
  }
}
