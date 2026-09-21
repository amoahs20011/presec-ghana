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

export enum OpportunityType {
  JOB = 'job',
  INTERNSHIP = 'internship',
  SCHOLARSHIP = 'scholarship',
  TRAINING = 'training',
  NATIONAL_SERVICE = 'national_service',
  GRADUATE_TRAINEE = 'graduate_trainee',
  FREELANCE = 'freelance',
}

export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  REMOTE = 'remote',
  HYBRID = 'hybrid',
}

@Entity('opportunities')
export class Opportunity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, default: OpportunityType.JOB })
  type: OpportunityType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'company_name', type: 'varchar', length: 255, nullable: true })
  companyName: string | null;

  @Column({ name: 'company_logo_url', type: 'text', nullable: true })
  companyLogoUrl: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  industry: string | null;

  @Column({ name: 'job_type', type: 'varchar', length: 50, nullable: true })
  jobType: JobType | null;

  @Column({ name: 'experience_level', type: 'varchar', length: 50, nullable: true })
  experienceLevel: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  qualification: string | null;

  @Column({ name: 'salary_range', type: 'varchar', length: 100, nullable: true })
  salaryRange: string | null;

  @Column({ type: 'date', nullable: true })
  deadline: Date | null;

  @Column({ name: 'application_url', type: 'varchar', length: 255, nullable: true })
  applicationUrl: string | null;

  @Column({ name: 'contact_email', type: 'varchar', length: 255, nullable: true })
  contactEmail: string | null;

  @Column({ name: 'posted_by', type: 'uuid', nullable: true })
  postedBy: string | null;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'posted_by' })
  poster: User | null;

  @Column({ name: 'school_id', type: 'uuid', nullable: true })
  schoolId: string | null;

  @ManyToOne(() => School, { nullable: true })
  @JoinColumn({ name: 'school_id' })
  school: School | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
