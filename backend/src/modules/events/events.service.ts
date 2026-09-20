import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThanOrEqual } from 'typeorm';
import { randomBytes } from 'crypto';
import { Event, EventType } from './event.entity';
import {
  EventRegistration,
  PaymentStatus,
} from './event-registration.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {
  SearchEventsDto,
  EventTimeFilter,
} from './dto/search-events.dto';
import { RegisterEventDto } from './dto/register-event.dto';
import { UserRole } from '../users/user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
    @InjectRepository(EventRegistration)
    private readonly regRepo: Repository<EventRegistration>,
  ) {}

  // ==================== EVENTS (ADMIN) ====================

  async create(dto: CreateEventDto, userId: string): Promise<Event> {
    const event = this.eventRepo.create({
      title: dto.title,
      description: dto.description || null,
      eventType: dto.eventType || EventType.REUNION,
      schoolId: dto.schoolId || null,
      yearGroupId: dto.yearGroupId || null,
      startDatetime: new Date(dto.startDatetime),
      endDatetime: dto.endDatetime ? new Date(dto.endDatetime) : null,
      locationName: dto.locationName || null,
      locationAddress: dto.locationAddress || null,
      locationLat: dto.locationLat?.toString() || null,
      locationLng: dto.locationLng?.toString() || null,
      coverPhotoUrl: dto.coverPhotoUrl || null,
      maxAttendees: dto.maxAttendees || null,
      registrationDeadline: dto.registrationDeadline
        ? new Date(dto.registrationDeadline)
        : null,
      ticketPrice: (dto.ticketPrice ?? 0).toString(),
      currency: dto.currency || 'GHS',
      isPublic: dto.isPublic ?? true,
      createdBy: userId,
    });
    return this.eventRepo.save(event);
  }

  async update(id: string, dto: UpdateEventDto): Promise<Event> {
    const event = await this.eventRepo.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');

    if (dto.title !== undefined) event.title = dto.title;
    if (dto.description !== undefined) event.description = dto.description;
    if (dto.eventType !== undefined) event.eventType = dto.eventType;
    if (dto.schoolId !== undefined) event.schoolId = dto.schoolId;
    if (dto.yearGroupId !== undefined) event.yearGroupId = dto.yearGroupId;
    if (dto.startDatetime !== undefined)
      event.startDatetime = new Date(dto.startDatetime);
    if (dto.endDatetime !== undefined)
      event.endDatetime = dto.endDatetime ? new Date(dto.endDatetime) : null;
    if (dto.locationName !== undefined) event.locationName = dto.locationName;
    if (dto.locationAddress !== undefined)
      event.locationAddress = dto.locationAddress;
    if (dto.coverPhotoUrl !== undefined)
      event.coverPhotoUrl = dto.coverPhotoUrl;
    if (dto.maxAttendees !== undefined) event.maxAttendees = dto.maxAttendees;
    if (dto.registrationDeadline !== undefined)
      event.registrationDeadline = dto.registrationDeadline
        ? new Date(dto.registrationDeadline)
        : null;
    if (dto.ticketPrice !== undefined)
      event.ticketPrice = dto.ticketPrice.toString();
    if (dto.currency !== undefined) event.currency = dto.currency;
    if (dto.isPublic !== undefined) event.isPublic = dto.isPublic;

    return this.eventRepo.save(event);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    const event = await this.eventRepo.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    await this.eventRepo.remove(event);
    return { deleted: true };
  }

  // ==================== EVENTS (PUBLIC) ====================

  async search(dto: SearchEventsDto) {
    const where: any = { isPublic: true };

    if (dto.eventType) where.eventType = dto.eventType;
    if (dto.schoolId) where.schoolId = dto.schoolId;
    if (dto.yearGroupId) where.yearGroupId = dto.yearGroupId;
    if (dto.isPublic !== undefined) where.isPublic = dto.isPublic;

    if (dto.time === EventTimeFilter.UPCOMING) {
      where.startDatetime = MoreThanOrEqual(new Date());
    } else if (dto.time === EventTimeFilter.PAST) {
      where.startDatetime = LessThan(new Date());
    }

    const qb = this.eventRepo
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.school', 'school')
      .leftJoinAndSelect('event.yearGroup', 'yearGroup')
      .where(where);

    if (dto.q) {
      qb.andWhere(
        `(event.title ILIKE :q OR event.description ILIKE :q OR event.locationName ILIKE :q)`,
        { q: `%${dto.q}%` },
      );
    }

    const order = dto.time === EventTimeFilter.PAST ? 'DESC' : 'ASC';
    qb.orderBy('event.startDatetime', order)
      .take(dto.limit || 20)
      .skip(dto.offset || 0);

    const [items, total] = await qb.getManyAndCount();
    return {
      items,
      total,
      limit: dto.limit || 20,
      offset: dto.offset || 0,
    };
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepo.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async findOneWithAttendeeCount(id: string) {
    const event = await this.findOne(id);
    const registeredCount = await this.regRepo.count({
      where: { eventId: id },
    });
    return { ...event, registeredCount };
  }

  // ==================== REGISTRATION ====================

  async register(
    eventId: string,
    userId: string,
    dto: RegisterEventDto,
  ): Promise<EventRegistration> {
    const event = await this.findOne(eventId);

    if (event.registrationDeadline && event.registrationDeadline < new Date()) {
      throw new BadRequestException('Registration deadline has passed');
    }

    if (event.maxAttendees) {
      const count = await this.regRepo.count({ where: { eventId } });
      if (count >= event.maxAttendees) {
        throw new BadRequestException('Event is full');
      }
    }

    const existing = await this.regRepo.findOne({
      where: { eventId, userId },
    });
    if (existing) {
      throw new ConflictException('You are already registered for this event');
    }

    const ticketCode = this.generateTicketCode();
    const isFree = Number(event.ticketPrice) === 0;

    const reg = this.regRepo.create({
      eventId,
      userId,
      ticketCode,
      qrCodeUrl: this.buildQrCodeUrl(ticketCode),
      paymentStatus: isFree ? PaymentStatus.FREE : PaymentStatus.PENDING,
      amountPaid: isFree ? '0' : '0',
      notes: dto.notes || null,
    });

    return this.regRepo.save(reg);
  }

  async cancelRegistration(
    eventId: string,
    userId: string,
  ): Promise<{ cancelled: true }> {
    const reg = await this.regRepo.findOne({ where: { eventId, userId } });
    if (!reg) throw new NotFoundException('Registration not found');
    await this.regRepo.remove(reg);
    return { cancelled: true };
  }

  async myRegistrations(userId: string) {
    return this.regRepo.find({
      where: { userId },
      relations: { event: true },
      order: { registeredAt: 'DESC' },
    });
  }

  async listAttendees(eventId: string) {
    const event = await this.findOne(eventId);
    const registrations = await this.regRepo.find({
      where: { eventId },
      relations: { user: true },
      order: { registeredAt: 'ASC' },
    });

    return {
      event: { id: event.id, title: event.title },
      attendees: registrations.map((r) => ({
        registrationId: r.id,
        ticketCode: r.ticketCode,
        paymentStatus: r.paymentStatus,
        amountPaid: r.amountPaid,
        checkedIn: r.checkedIn,
        checkedInAt: r.checkedInAt,
        registeredAt: r.registeredAt,
        user: {
          id: r.user.id,
          email: r.user.email,
          firstName: r.user.firstName,
          lastName: r.user.lastName,
          phone: r.user.phone,
        },
      })),
      total: registrations.length,
    };
  }

  // ==================== CHECK-IN ====================

  async checkIn(eventId: string, ticketCode: string) {
    const reg = await this.regRepo.findOne({
      where: { eventId, ticketCode },
      relations: { user: true },
    });
    if (!reg) {
      throw new NotFoundException('Ticket not found for this event');
    }

    if (reg.checkedIn) {
      return {
        alreadyCheckedIn: true,
        checkedInAt: reg.checkedInAt,
        attendee: {
          id: reg.user.id,
          firstName: reg.user.firstName,
          lastName: reg.user.lastName,
        },
      };
    }

    if (
      reg.paymentStatus === PaymentStatus.PENDING &&
      Number(reg.amountPaid) === 0
    ) {
      throw new BadRequestException(
        'Ticket not paid. Please complete payment before check-in.',
      );
    }

    reg.checkedIn = true;
    reg.checkedInAt = new Date();
    await this.regRepo.save(reg);

    return {
      alreadyCheckedIn: false,
      checkedInAt: reg.checkedInAt,
      attendee: {
        id: reg.user.id,
        firstName: reg.user.firstName,
        lastName: reg.user.lastName,
      },
    };
  }

  // ==================== HELPERS ====================

  private generateTicketCode(): string {
    const stamp = Date.now().toString(36).toUpperCase();
    const rand = randomBytes(3).toString('hex').toUpperCase();
    return `PRSC-${stamp}-${rand}`;
  }

  private buildQrCodeUrl(ticketCode: string): string {
    // Using a public QR generator — later we'll generate our own or store in Cloudinary
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      ticketCode,
    )}`;
  }
}
