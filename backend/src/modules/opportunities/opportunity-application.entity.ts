import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Opportunity } from './opportunity.entity';
import { User } from '../users/user.entity';

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  SHORTLISTED = 'shortlisted',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

@Entity('opportunity_applications')
@Unique(['opportunityId', 'userId'])
export class OpportunityApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'opportunity_id', type: 'uuid' })
  opportunityId: string;

  @ManyToOne(() => Opportunity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'opportunity_id' })
  opportunity: Opportunity;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'varchar',
    length: 20,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column({ name: 'cover_note', type: 'text', nullable: true })
  coverNote: string | null;

  @CreateDateColumn({ name: 'applied_at' })
  appliedAt: Date;
}
