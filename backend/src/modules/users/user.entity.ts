import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  STUDENT = 'student',
  ALUMNI = 'alumni',
  TEACHER = 'teacher',
  SCHOOL_ADMIN = 'school_admin',
  ALUMNI_ADMIN = 'alumni_admin',
  SUPER_ADMIN = 'super_admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ name: 'password_hash', type: 'varchar', length: 255, nullable: true })
  passwordHash: string | null;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ name: 'other_names', type: 'varchar', length: 100, nullable: true })
  otherNames: string | null;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  gender: string | null;

  @Column({ name: 'profile_photo_url', type: 'text', nullable: true })
  profilePhotoUrl: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    default: UserRole.ALUMNI,
  })
  role: UserRole;

  // NEW: detailed user type
  @Column({ name: 'user_type', type: 'varchar', length: 50, nullable: true })
  userType: string | null;

  // NEW: school affiliation (for teachers/staff)
  @Column({ name: 'school_id', type: 'uuid', nullable: true })
  schoolId: string | null;

  // NEW: position (e.g. "Headmaster", "Senior Teacher")
  @Column({ name: 'current_position', type: 'varchar', length: 100, nullable: true })
  currentPosition: string | null;

  // NEW: department
  @Column({ type: 'varchar', length: 100, nullable: true })
  department: string | null;

  // NEW: short bio
  @Column({ name: 'bio_short', type: 'text', nullable: true })
  bioShort: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ name: 'email_verified_at', type: 'timestamp', nullable: true })
  emailVerifiedAt: Date | null;

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
