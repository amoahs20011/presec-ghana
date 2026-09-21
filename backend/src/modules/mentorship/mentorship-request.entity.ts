import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { MentorshipOffer } from './mentorship-offer.entity';
import { User } from '../users/user.entity';

export enum MentorshipRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('mentorship_requests')
@Unique(['mentorshipId', 'menteeId'])
export class MentorshipRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'mentorship_id', type: 'uuid' })
  mentorshipId: string;

  @ManyToOne(() => MentorshipOffer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mentorship_id' })
  mentorship: MentorshipOffer;

  @Column({ name: 'mentee_id', type: 'uuid' })
  menteeId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'mentee_id' })
  mentee: User;

  @Column({ type: 'text', nullable: true })
  message: string | null;

  @Column({
    type: 'varchar',
    length: 20,
    default: MentorshipRequestStatus.PENDING,
  })
  status: MentorshipRequestStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'responded_at', type: 'timestamp', nullable: true })
  respondedAt: Date | null;
}
