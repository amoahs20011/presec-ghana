import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { MentorshipOffer } from './mentorship-offer.entity';
import {
  MentorshipRequest,
  MentorshipRequestStatus,
} from './mentorship-request.entity';
import { CreateMentorshipOfferDto } from './dto/create-mentorship-offer.dto';
import { RequestMentorshipDto } from './dto/request-mentorship.dto';

@Injectable()
export class MentorshipService {
  constructor(
    @InjectRepository(MentorshipOffer)
    private readonly offerRepo: Repository<MentorshipOffer>,
    @InjectRepository(MentorshipRequest)
    private readonly reqRepo: Repository<MentorshipRequest>,
  ) {}

  // ---------- OFFERS ----------

  async createOffer(
    dto: CreateMentorshipOfferDto,
    userId: string,
  ): Promise<MentorshipOffer> {
    const offer = this.offerRepo.create({
      mentorId: userId,
      area: dto.area,
      description: dto.description || null,
      maxMentees: dto.maxMentees || 3,
      currentMentees: 0,
      isActive: true,
    });
    return this.offerRepo.save(offer);
  }

  async listOffers(area?: string) {
    const where: any = { isActive: true };
    if (area) where.area = ILike(`%${area}%`);

    const offers = await this.offerRepo.find({
      where,
      relations: { mentor: true },
      order: { createdAt: 'DESC' },
    });

    return offers.map((o) => this.sanitizeOffer(o));
  }

  async findOffer(id: string) {
    const offer = await this.offerRepo.findOne({ where: { id } });
    if (!offer) throw new NotFoundException('Mentorship offer not found');
    return this.sanitizeOffer(offer);
  }

  async deleteOffer(id: string, userId: string) {
    const offer = await this.offerRepo.findOne({ where: { id } });
    if (!offer) throw new NotFoundException('Mentorship offer not found');
    if (offer.mentorId !== userId) {
      throw new ForbiddenException('You can only delete your own offer');
    }
    await this.offerRepo.remove(offer);
    return { deleted: true };
  }

  // ---------- REQUESTS ----------

  async requestMentorship(
    offerId: string,
    userId: string,
    dto: RequestMentorshipDto,
  ): Promise<MentorshipRequest> {
    const offer = await this.offerRepo.findOne({ where: { id: offerId } });
    if (!offer) throw new NotFoundException('Mentorship offer not found');
    if (!offer.isActive) {
      throw new ConflictException('Mentorship offer is no longer active');
    }
    if (offer.mentorId === userId) {
      throw new ConflictException('You cannot mentor yourself');
    }
    if (offer.currentMentees >= offer.maxMentees) {
      throw new ConflictException('This mentor is currently full');
    }

    const existing = await this.reqRepo.findOne({
      where: { mentorshipId: offerId, menteeId: userId },
    });
    if (existing) {
      throw new ConflictException('You have already requested this mentor');
    }

    const req = this.reqRepo.create({
      mentorshipId: offerId,
      menteeId: userId,
      message: dto.message || null,
      status: MentorshipRequestStatus.PENDING,
    });
    return this.reqRepo.save(req);
  }

  async myRequestsAsMentee(userId: string) {
    return this.reqRepo.find({
      where: { menteeId: userId },
      relations: { mentorship: true },
      order: { createdAt: 'DESC' },
    });
  }

  async myRequestsAsMentor(userId: string) {
    const offers = await this.offerRepo.find({ where: { mentorId: userId } });
    if (offers.length === 0) return [];

    const requests = await this.reqRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.mentorship', 'm')
      .leftJoinAndSelect('r.mentee', 'mentee')
      .where('m.mentor_id = :userId', { userId })
      .orderBy('r.created_at', 'DESC')
      .getMany();

    return requests.map((r) => this.sanitizeRequest(r));
  }

  async respond(
    requestId: string,
    userId: string,
    status: MentorshipRequestStatus,
  ): Promise<MentorshipRequest> {
    const req = await this.reqRepo.findOne({
      where: { id: requestId },
      relations: { mentorship: true },
    });
    if (!req) throw new NotFoundException('Mentorship request not found');

    if (req.mentorship.mentorId !== userId) {
      throw new ForbiddenException('Only the mentor can respond');
    }

    if (req.status !== MentorshipRequestStatus.PENDING) {
      throw new ConflictException('This request has already been responded to');
    }

    req.status = status;
    req.respondedAt = new Date();
    await this.reqRepo.save(req);

    // Increment current mentees if accepted
    if (status === MentorshipRequestStatus.ACCEPTED) {
      await this.offerRepo.increment({ id: req.mentorshipId }, 'currentMentees', 1);
    }

    return req;
  }

  // ---------- HELPERS ----------

  private sanitizeOffer(offer: MentorshipOffer) {
    const safe: any = { ...offer };
    if (safe.mentor) delete safe.mentor.passwordHash;
    return safe;
  }

  private sanitizeRequest(req: MentorshipRequest) {
    const safe: any = { ...req };
    if (safe.mentee) delete safe.mentee.passwordHash;
    if (safe.mentorship?.mentor) delete safe.mentorship.mentor.passwordHash;
    return safe;
  }
}
