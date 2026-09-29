import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get('user-types')
  async getUserTypes() {
    return this.usersService.getUserTypes();
  }

  // ============ ADMIN-ONLY ENDPOINTS ============

  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @Get()
  async findAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('role') role?: string,
  ) {
    return this.usersService.findAll({
      limit: limit ? parseInt(limit, 10) : 50,
      offset: offset ? parseInt(offset, 10) : 0,
      role,
    });
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @Get('stats')
  async getStats() {
    return this.usersService.getStats();
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Patch(':id/role')
  async updateRole(
    @Param('id') id: string,
    @Body('role') role: string,
  ) {
    return this.usersService.updateRole(id, role);
  }
}
