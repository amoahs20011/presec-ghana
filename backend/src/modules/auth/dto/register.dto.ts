import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { UserRole } from '../../users/user.entity';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  otherNames?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  // NEW: detailed user type code (e.g. 'past_student', 'current_teacher')
  @IsOptional()
  @IsString()
  @MaxLength(50)
  userType?: string;

  // NEW: school ID (defaults to PRESEC Tema C11 if not provided)
  @IsOptional()
  @IsString()
  schoolId?: string;

  // NEW: programme (for students/alumni)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  programme?: string;

  // NEW: graduation year (for alumni)
  @IsOptional()
  @IsInt()
  @Min(1950)
  @Max(2100)
  graduationYear?: number;

  // NEW: current position (for teachers/headmasters)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  currentPosition?: string;

  // NEW: department (for teachers)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  department?: string;
}
