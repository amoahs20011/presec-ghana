import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { School } from '../schools/school.entity';
import { YearGroup } from '../year-groups/year-group.entity';

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

@Entity('alumni_profiles')
export class AlumniProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'school_id', type: 'uuid', nullable: true })
  schoolId: string | null;

  @ManyToOne(() => School, { nullable: true, eager: true })
  @JoinColumn({ name: 'school_id' })
  school: School | null;

  @Column({ name: 'year_group_id', type: 'uuid', nullable: true })
  yearGroupId: string | null;

  @ManyToOne(() => YearGroup, { nullable: true, eager: true })
  @JoinColumn({ name: 'year_group_id' })
  yearGroup: YearGroup | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  programme: string | null;

  @Column({ name: 'graduation_year', type: 'int', nullable: true })
  graduationYear: number | null;

  @Column({ name: 'current_profession', type: 'varchar', length: 255, nullable: true })
  currentProfession: string | null;

  @Column({ name: 'current_employer', type: 'varchar', length: 255, nullable: true })
  currentEmployer: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  industry: string | null;

  @Column({ name: 'location_country', type: 'varchar', length: 100, nullable: true })
  locationCountry: string | null;

  @Column({ name: 'location_city', type: 'varchar', length: 100, nullable: true })
  locationCity: string | null;

  @Column({ type: 'text', array: true, nullable: true })
  skills: string[] | null;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ name: 'linkedin_url', type: 'varchar', length: 255, nullable: true })
  linkedinUrl: string | null;

  @Column({ name: 'website_url', type: 'varchar', length: 255, nullable: true })
  websiteUrl: string | null;

  @Column({ name: 'is_available_for_mentorship', type: 'boolean', default: false })
  isAvailableForMentorship: boolean;

  @Column({ name: 'mentorship_areas', type: 'text', array: true, nullable: true })
  mentorshipAreas: string[] | null;

  @Column({
    name: 'verification_status',
    type: 'varchar',
    length: 20,
    default: VerificationStatus.PENDING,
  })
  verificationStatus: VerificationStatus;

  @Column({ name: 'verified_by', type: 'uuid', nullable: true })
  verifiedBy: string | null;

  @Column({ name: 'verified_at', type: 'timestamp', nullable: true })
  verifiedAt: Date | null;

  @Column({ name: 'is_public', type: 'boolean', default: true })
  isPublic: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
