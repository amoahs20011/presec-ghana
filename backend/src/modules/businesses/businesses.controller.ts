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
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { SearchBusinessesDto } from './dto/search-businesses.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/decorators/current-user.decorator';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly service: BusinessesService) {}

  @Public()
  @Get()
  async search(@Query() dto: SearchBusinessesDto) {
    return this.service.search(dto);
  }

  @Get('me')
  async myBusinesses(@CurrentUser() user: AuthUser) {
    return this.service.myBusinesses(user.id);
  }

  @Post()
  async create(
    @Body() dto: CreateBusinessDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.create(dto, user.id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN, UserRole.SCHOOL_ADMIN)
  @Patch(':id/verify')
  async verify(@Param('id') id: string) {
    return this.service.verify(id);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: CreateBusinessDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.update(id, dto, user.id, user.role as UserRole);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.remove(id, user.id, user.role as UserRole);
  }
}
