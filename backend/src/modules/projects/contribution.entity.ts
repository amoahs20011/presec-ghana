import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { User } from '../users/user.entity';

export enum ContributionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  MOBILE_MONEY = 'mobile_money',
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
  OTHER = 'other',
}

@Entity('contributions')
export class Contribution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'project_id', type: 'uuid' })
  projectId: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  amount: string;

  @Column({ type: 'varchar', length: 10, default: 'GHS' })
  currency: string;

  @Column({
    name: 'payment_method',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  paymentMethod: PaymentMethod | null;

  @Column({
    name: 'payment_reference',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  paymentReference: string | null;

  @Column({ name: 'is_anonymous', type: 'boolean', default: false })
  isAnonymous: boolean;

  @Column({ type: 'text', nullable: true })
  message: string | null;

  @Column({
    type: 'varchar',
    length: 20,
    default: ContributionStatus.PENDING,
  })
  status: ContributionStatus;

  @Column({ name: 'confirmed_by', type: 'uuid', nullable: true })
  confirmedBy: string | null;

  @Column({ name: 'confirmed_at', type: 'timestamp', nullable: true })
  confirmedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
