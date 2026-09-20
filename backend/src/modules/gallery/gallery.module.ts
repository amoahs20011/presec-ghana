import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalleryAlbum } from './gallery-album.entity';
import { GalleryPhoto } from './gallery-photo.entity';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { School } from '../schools/school.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GalleryAlbum, GalleryPhoto, School, User]),
  ],
  providers: [GalleryService],
  controllers: [GalleryController],
  exports: [GalleryService],
})
export class GalleryModule {}
