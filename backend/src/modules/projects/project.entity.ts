import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { School } from '../schools/school.entity';
import { User } from '../users/user.entity';

export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ProjectCategory {
  INFRASTRUCTURE = 'infrastructure',
  EQUIPMENT = 'equipment',
  ACADEMIC = 'academic',
  SPORTS = 'sports',
  TECHNOLOGY = 'technology',
  LIBRARY = 'library',
  SANITATION = 'sanitation',
  OTHER = 'other',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'school_id', type: 'uuid', nullable: true })
  schoolId: string | null;

  @ManyToOne(() => School, { nullable: true, eager: true })
  @JoinColumn({ name: 'school_id' })
  school: School | null;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    default: ProjectCategory.INFRASTRUCTURE,
  })
  category: ProjectCategory;

  @Column({
    name: 'target_amount',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  targetAmount: string;

  @Column({
    name: 'raised_amount',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  raisedAmount: string;

  @Column({ type: 'varchar', length: 10, default: 'GHS' })
  currency: string;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date | null;

  @Column({
    name: 'target_completion_date',
    type: 'date',
    nullable: true,
  })
  targetCompletionDate: Date | null;

  @Column({
    type: 'varchar',
    length: 50,
    default: ProjectStatus.PLANNING,
  })
  status: ProjectStatus;

  @Column({ name: 'cover_photo_url', type: 'text', nullable: true })
  coverPhotoUrl: string | null;

  @Column({
    name: 'progress_percentage',
    type: 'int',
    default: 0,
  })
  progressPercentage: number;

  @Column({ name: 'is_public', type: 'boolean', default: true })
  isPublic: boolean;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
