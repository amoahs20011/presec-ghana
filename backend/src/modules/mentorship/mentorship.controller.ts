import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { MentorshipService } from './mentorship.service';
import { CreateMentorshipOfferDto } from './dto/create-mentorship-offer.dto';
import { RequestMentorshipDto } from './dto/request-mentorship.dto';
import { RespondMentorshipDto } from './dto/respond-mentorship.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/decorators/current-user.decorator';

@Controller('mentorship')
export class MentorshipController {
  constructor(private readonly service: MentorshipService) {}

  // ---------- PUBLIC ----------

  @Public()
  @Get('offers')
  async listOffers(@Query('area') area?: string) {
    return this.service.listOffers(area);
  }

  // ---------- AUTHENTICATED (specific routes first) ----------

  @Get('requests/as-mentee')
  async myRequestsAsMentee(@CurrentUser() user: AuthUser) {
    return this.service.myRequestsAsMentee(user.id);
  }

  @Get('requests/as-mentor')
  async myRequestsAsMentor(@CurrentUser() user: AuthUser) {
    return this.service.myRequestsAsMentor(user.id);
  }

  @Post('offers')
  async createOffer(
    @Body() dto: CreateMentorshipOfferDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.createOffer(dto, user.id);
  }

  @Patch('requests/:id/respond')
  async respond(
    @Param('id') id: string,
    @Body() dto: RespondMentorshipDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.respond(id, user.id, dto.status);
  }

  @Post('offers/:id/request')
  async requestMentorship(
    @Param('id') offerId: string,
    @Body() dto: RequestMentorshipDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.requestMentorship(offerId, user.id, dto);
  }

  @Delete('offers/:id')
  async deleteOffer(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.deleteOffer(id, user.id);
  }

  // ---------- DYNAMIC ----------

  @Public()
  @Get('offers/:id')
  async findOffer(@Param('id') id: string) {
    return this.service.findOffer(id);
  }
}
