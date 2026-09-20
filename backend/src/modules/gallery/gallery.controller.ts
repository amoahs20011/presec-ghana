import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { AddPhotoDto } from './dto/add-photo.dto';
import { SearchAlbumsDto } from './dto/search-albums.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/decorators/current-user.decorator';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly service: GalleryService) {}

  @Public()
  @Get('albums')
  async searchAlbums(@Query() dto: SearchAlbumsDto) {
    return this.service.searchAlbums(dto);
  }

  @Public()
  @Get('albums/:id')
  async findAlbum(@Param('id') id: string) {
    return this.service.findAlbum(id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN, UserRole.SCHOOL_ADMIN)
  @Post('albums')
  async createAlbum(
    @Body() dto: CreateAlbumDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.createAlbum(dto, user.id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN, UserRole.SCHOOL_ADMIN)
  @Post('albums/:id/photos')
  async addPhoto(
    @Param('id') albumId: string,
    @Body() dto: AddPhotoDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.addPhoto(albumId, dto, user.id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN, UserRole.SCHOOL_ADMIN)
  @Delete('photos/:id')
  async removePhoto(@Param('id') id: string) {
    return this.service.removePhoto(id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ALUMNI_ADMIN, UserRole.SCHOOL_ADMIN)
  @Delete('albums/:id')
  async removeAlbum(@Param('id') id: string) {
    return this.service.removeAlbum(id);
  }
}
