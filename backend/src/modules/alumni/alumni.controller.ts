import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AlumniService } from './alumni.service';
import { UpsertAlumniProfileDto } from './dto/upsert-alumni-profile.dto';
import { SearchAlumniDto } from './dto/search-alumni.dto';
import { VerifyAlumniDto } from './dto/verify-alumni.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('alumni')
export class AlumniController {
  constructor(private readonly alumniService: AlumniService) {}

  @Public()
  @Get('search')
  async search(@Query() dto: SearchAlumniDto) {
    return this.alumniService.search(dto);
  }

  @Get('me')
  async getMe(@CurrentUser() user: AuthUser) {
    return this.alumniService.getMyProfile(user.id);
  }

  @Put('me')
  async upsertMe(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpsertAlumniProfileDto,
  ) {
    return this.alumniService.upsertMyProfile(user.id, dto);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN)
  @Get('pending')
  async listPending() {
    return this.alumniService.listPending();
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN)
  @Patch(':id/verify')
  async verify(
    @Param('id') id: string,
    @Body() dto: VerifyAlumniDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.alumniService.verify(id, dto.status, user.id);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.alumniService.findPublicProfile(id);
  }
}
