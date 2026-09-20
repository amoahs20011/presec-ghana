import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
} from '@nestjs/common';
import { HeritageService } from './heritage.service';
import { CreateHeritageItemDto } from './dto/create-heritage-item.dto';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/decorators/current-user.decorator';

@Controller('heritage')
export class HeritageController {
  constructor(private readonly service: HeritageService) {}

  @Public()
  @Get()
  async listItems() {
    return this.service.listItems();
  }

  @Public()
  @Get('achievements')
  async listAchievements() {
    return this.service.listAchievements();
  }

  @Public()
  @Get(':id')
  async findItem(@Param('id') id: string) {
    return this.service.findItem(id);
  }

  // Authenticated contributors
  @Post()
  async createItem(
    @Body() dto: CreateHeritageItemDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.createItem(dto, user.id);
  }

  // Admin
  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN, UserRole.SCHOOL_ADMIN)
  @Patch(':id/approve')
  async approveItem(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.approveItem(id, user.id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN, UserRole.SCHOOL_ADMIN)
  @Delete(':id')
  async removeItem(@Param('id') id: string) {
    return this.service.removeItem(id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN, UserRole.SCHOOL_ADMIN)
  @Post('achievements')
  async createAchievement(@Body() dto: CreateAchievementDto) {
    return this.service.createAchievement(dto);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN, UserRole.SCHOOL_ADMIN)
  @Delete('achievements/:id')
  async removeAchievement(@Param('id') id: string) {
    return this.service.removeAchievement(id);
  }
}
