import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Event } from './event.entity';
import { User } from '../users/user.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FREE = 'free',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity('event_registrations')
@Unique(['eventId', 'userId'])
export class EventRegistration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'event_id', type: 'uuid' })
  eventId: string;

  @ManyToOne(() => Event, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    name: 'ticket_code',
    type: 'varchar',
    length: 50,
    unique: true,
  })
  ticketCode: string;

  @Column({ name: 'qr_code_url', type: 'text', nullable: true })
  qrCodeUrl: string | null;

  @Column({
    name: 'payment_status',
    type: 'varchar',
    length: 20,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({
    name: 'payment_reference',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  paymentReference: string | null;

  @Column({
    name: 'amount_paid',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  amountPaid: string;

  @Column({ name: 'checked_in', type: 'boolean', default: false })
  checkedIn: boolean;

  @Column({ name: 'checked_in_at', type: 'timestamp', nullable: true })
  checkedInAt: Date | null;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'registered_at' })
  registeredAt: Date;
}
