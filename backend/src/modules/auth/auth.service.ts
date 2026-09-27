import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserRole } from '../users/user.entity';
import { AlumniProfile, VerificationStatus } from '../alumni/alumni-profile.entity';
import { School } from '../schools/school.entity';

const USER_TYPE_TO_ROLE: Record<string, UserRole> = {
  current_student: UserRole.STUDENT,
  past_student: UserRole.ALUMNI,
  current_teacher: UserRole.TEACHER,
  past_teacher: UserRole.TEACHER,
  current_headmaster: UserRole.SCHOOL_ADMIN,
  past_headmaster: UserRole.SCHOOL_ADMIN,
  current_staff: UserRole.TEACHER,
  past_staff: UserRole.TEACHER,
  investor_donor: UserRole.ALUMNI,
  parent: UserRole.ALUMNI,
  friend_of_presec: UserRole.ALUMNI,
};

const DEFAULT_SCHOOL_CODE = 'PRESEC-TC11';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(AlumniProfile)
    private readonly alumniRepo: Repository<AlumniProfile>,
    @InjectRepository(School)
    private readonly schoolRepo: Repository<School>,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    // Determine role from userType if not explicitly provided
    const role =
      dto.role ||
      (dto.userType && USER_TYPE_TO_ROLE[dto.userType]) ||
      UserRole.ALUMNI;

    // Default school to PRESEC Tema C11
    let schoolId = dto.schoolId || null;
    if (!schoolId) {
      const defaultSchool = await this.schoolRepo.findOne({
        where: { code: DEFAULT_SCHOOL_CODE },
      });
      if (defaultSchool) {
        schoolId = defaultSchool.id;
      }
    }

    const user = await this.usersService.create({
      email,
      passwordHash,
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      otherNames: dto.otherNames?.trim() || null,
      phone: dto.phone || null,
      role,
      userType: dto.userType || null,
      schoolId,
      currentPosition: dto.currentPosition || null,
      department: dto.department || null,
    });

    // Auto-create alumni profile for past students
    if (dto.userType === 'past_student' && schoolId) {
      try {
        const profile = this.alumniRepo.create({
  userId: user.id,
  schoolId,
  programme: dto.programme || null,
  graduationYear: dto.graduationYear || null,
  verificationStatus: VerificationStatus.PENDING,
});
        await this.alumniRepo.save(profile);
        this.logger.log(`Created alumni profile for ${user.email}`);
      } catch (err) {
        this.logger.error(
          `Failed to create alumni profile for ${user.email}`,
          err,
        );
        // Don't fail registration if profile creation fails
      }
    }

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(
      dto.email.toLowerCase().trim(),
    );
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new BadRequestException('Account is deactivated');
    }

    await this.usersService.update(user.id, { lastLoginAt: new Date() });

    return this.buildAuthResponse(user);
  }

  async getMe(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.sanitizeUser(user);
  }

  private buildAuthResponse(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      user: this.sanitizeUser(user),
    };
  }

  private sanitizeUser(user: User) {
    const { passwordHash, ...safe } = user;
    return safe;
  }
}
