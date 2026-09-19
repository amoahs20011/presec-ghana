import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { School } from '../schools/school.entity';

@Entity('year_groups')
export class YearGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'school_id', type: 'uuid' })
  schoolId: string;

  @ManyToOne(() => School, { eager: true })
  @JoinColumn({ name: 'school_id' })
  school: School;

  @Column({ name: 'graduation_year', type: 'int' })
  graduationYear: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'cover_photo_url', type: 'text', nullable: true })
  coverPhotoUrl: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
