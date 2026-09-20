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
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { SearchEventsDto } from './dto/search-events.dto';
import { RegisterEventDto } from './dto/register-event.dto';
import { CheckinDto } from './dto/checkin.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/decorators/current-user.decorator';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // ==================== PUBLIC ====================

  @Public()
  @Get()
  async search(@Query() dto: SearchEventsDto) {
    return this.eventsService.search(dto);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOneWithAttendeeCount(id);
  }

  // ==================== AUTHENTICATED ====================

  @Post(':id/register')
  async register(
    @Param('id') eventId: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: RegisterEventDto,
  ) {
    return this.eventsService.register(eventId, user.id, dto);
  }

  @Delete(':id/register')
  async cancelRegistration(
    @Param('id') eventId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.eventsService.cancelRegistration(eventId, user.id);
  }

  @Get('me/registrations')
  async myRegistrations(@CurrentUser() user: AuthUser) {
    return this.eventsService.myRegistrations(user.id);
  }

  // ==================== ADMIN ====================

  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN, UserRole.SCHOOL_ADMIN)
  @Post()
  async create(
    @Body() dto: CreateEventDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.eventsService.create(dto, user.id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN, UserRole.SCHOOL_ADMIN)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN, UserRole.SCHOOL_ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN, UserRole.SCHOOL_ADMIN)
  @Get(':id/attendees')
  async listAttendees(@Param('id') id: string) {
    return this.eventsService.listAttendees(id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN, UserRole.SCHOOL_ADMIN)
  @Patch(':id/checkin')
  async checkin(@Param('id') id: string, @Body() dto: CheckinDto) {
    return this.eventsService.checkIn(id, dto.ticketCode);
  }
}
