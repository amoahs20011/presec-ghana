import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GalleryAlbum } from './gallery-album.entity';
import { User } from '../users/user.entity';

@Entity('gallery_photos')
export class GalleryPhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'album_id', type: 'uuid' })
  albumId: string;

  @ManyToOne(() => GalleryAlbum, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'album_id' })
  album: GalleryAlbum;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'text', nullable: true })
  caption: string | null;

  @Column({ name: 'uploaded_by', type: 'uuid', nullable: true })
  uploadedBy: string | null;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'uploaded_by' })
  uploader: User | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
