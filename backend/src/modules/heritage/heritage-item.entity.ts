import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { School } from '../schools/school.entity';
import { User } from '../users/user.entity';

export enum HeritageType {
  PHOTO = 'photo',
  DOCUMENT = 'document',
  VIDEO = 'video',
  AUDIO = 'audio',
  ARTIFACT = 'artifact',
  NEWSPAPER = 'newspaper',
  YEARBOOK = 'yearbook',
  SONG = 'song',
  MEMORY = 'memory',
}

@Entity('heritage_items')
export class HeritageItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'school_id', type: 'uuid', nullable: true })
  schoolId: string | null;

  @ManyToOne(() => School, { nullable: true, eager: true })
  @JoinColumn({ name: 'school_id' })
  school: School | null;

  @Column({
    type: 'varchar',
    length: 50,
    default: HeritageType.PHOTO,
  })
  type: HeritageType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'file_url', type: 'text', nullable: true })
  fileUrl: string | null;

  @Column({ name: 'thumbnail_url', type: 'text', nullable: true })
  thumbnailUrl: string | null;

  @Column({ name: 'year_estimate', type: 'int', nullable: true })
  yearEstimate: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  source: string | null;

  @Column({ name: 'contributor_id', type: 'uuid', nullable: true })
  contributorId: string | null;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'contributor_id' })
  contributor: User | null;

  @Column({ name: 'is_approved', type: 'boolean', default: false })
  isApproved: boolean;

  @Column({ name: 'approved_by', type: 'uuid', nullable: true })
  approvedBy: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
