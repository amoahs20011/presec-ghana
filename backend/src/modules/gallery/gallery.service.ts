import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GalleryAlbum } from './gallery-album.entity';
import { GalleryPhoto } from './gallery-photo.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { AddPhotoDto } from './dto/add-photo.dto';
import { SearchAlbumsDto } from './dto/search-albums.dto';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(GalleryAlbum)
    private readonly albumRepo: Repository<GalleryAlbum>,
    @InjectRepository(GalleryPhoto)
    private readonly photoRepo: Repository<GalleryPhoto>,
  ) {}

  async createAlbum(dto: CreateAlbumDto, userId: string): Promise<GalleryAlbum> {
    const album = this.albumRepo.create({
      schoolId: dto.schoolId || null,
      title: dto.title,
      description: dto.description || null,
      coverPhotoUrl: dto.coverPhotoUrl || null,
      isPublic: dto.isPublic ?? true,
      createdBy: userId,
    });
    return this.albumRepo.save(album);
  }

  async searchAlbums(dto: SearchAlbumsDto) {
    const where: any = { isPublic: true };
    if (dto.schoolId) where.schoolId = dto.schoolId;
    if (dto.isPublic !== undefined) where.isPublic = dto.isPublic;

    const qb = this.albumRepo
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.school', 'school')
      .where(where);

    if (dto.q) {
      qb.andWhere(`(album.title ILIKE :q OR album.description ILIKE :q)`, {
        q: `%${dto.q}%`,
      });
    }

    qb.orderBy('album.createdAt', 'DESC')
      .take(dto.limit || 20)
      .skip(dto.offset || 0);

    const [items, total] = await qb.getManyAndCount();

    // Attach photo count per album
    const enriched = await Promise.all(
      items.map(async (album) => {
        const photoCount = await this.photoRepo.count({
          where: { albumId: album.id },
        });
        return { ...album, photoCount };
      }),
    );

    return {
      items: enriched,
      total,
      limit: dto.limit || 20,
      offset: dto.offset || 0,
    };
  }

  async findAlbum(id: string) {
    const album = await this.albumRepo.findOne({ where: { id } });
    if (!album) throw new NotFoundException('Album not found');
    const photos = await this.photoRepo.find({
      where: { albumId: id },
      order: { createdAt: 'ASC' },
    });
    return { ...album, photos };
  }

  async addPhoto(
    albumId: string,
    dto: AddPhotoDto,
    userId: string,
  ): Promise<GalleryPhoto> {
    const album = await this.albumRepo.findOne({ where: { id: albumId } });
    if (!album) throw new NotFoundException('Album not found');

    const photo = this.photoRepo.create({
      albumId,
      url: dto.url,
      caption: dto.caption || null,
      uploadedBy: userId,
    });
    return this.photoRepo.save(photo);
  }

  async removePhoto(photoId: string) {
    const photo = await this.photoRepo.findOne({ where: { id: photoId } });
    if (!photo) throw new NotFoundException('Photo not found');
    await this.photoRepo.remove(photo);
    return { deleted: true };
  }

  async removeAlbum(id: string) {
    const album = await this.albumRepo.findOne({ where: { id } });
    if (!album) throw new NotFoundException('Album not found');
    await this.albumRepo.remove(album);
    return { deleted: true };
  }
}
