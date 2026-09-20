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
import { YearGroup } from '../year-groups/year-group.entity';
import { User } from '../users/user.entity';

export enum EventType {
  REUNION = 'reunion',
  HOMECOMING = 'homecoming',
  GET_TOGETHER = 'get_together',
  SCHOOL_PROGRAMME = 'school_programme',
  FUNDRAISER = 'fundraiser',
  OTHER = 'other',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    name: 'event_type',
    type: 'varchar',
    length: 50,
    default: EventType.REUNION,
  })
  eventType: EventType;

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

  @Column({ name: 'start_datetime', type: 'timestamp' })
  startDatetime: Date;

  @Column({ name: 'end_datetime', type: 'timestamp', nullable: true })
  endDatetime: Date | null;

  @Column({ name: 'location_name', type: 'varchar', length: 255, nullable: true })
  locationName: string | null;

  @Column({ name: 'location_address', type: 'text', nullable: true })
  locationAddress: string | null;

  @Column({
    name: 'location_lat',
    type: 'decimal',
    precision: 10,
    scale: 8,
    nullable: true,
  })
  locationLat: string | null;

  @Column({
    name: 'location_lng',
    type: 'decimal',
    precision: 11,
    scale: 8,
    nullable: true,
  })
  locationLng: string | null;

  @Column({ name: 'cover_photo_url', type: 'text', nullable: true })
  coverPhotoUrl: string | null;

  @Column({ name: 'max_attendees', type: 'int', nullable: true })
  maxAttendees: number | null;

  @Column({
    name: 'registration_deadline',
    type: 'timestamp',
    nullable: true,
  })
  registrationDeadline: Date | null;

  @Column({
    name: 'ticket_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  ticketPrice: string;

  @Column({ type: 'varchar', length: 10, default: 'GHS' })
  currency: string;

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
