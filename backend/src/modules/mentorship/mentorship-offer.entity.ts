import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('mentorship_offers')
export class MentorshipOffer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'mentor_id', type: 'uuid' })
  mentorId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'mentor_id' })
  mentor: User;

  @Column({ type: 'varchar', length: 255 })
  area: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'max_mentees', type: 'int', default: 3 })
  maxMentees: number;

  @Column({ name: 'current_mentees', type: 'int', default: 0 })
  currentMentees: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
