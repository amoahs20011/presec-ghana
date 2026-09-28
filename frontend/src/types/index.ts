export interface School {
  id: string;
  name: string;
  code: string | null;
  type: string | null;
  establishedYear: number | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logoUrl: string | null;
  description: string | null;
  isActive: boolean;
  district?: any;
}

export interface UserType {
  code: string;
  label: string;
  category: string;
  description: string;
}

export interface Alumni {
  id: string;
  userId: string;
  programme: string | null;
  graduationYear: number | null;
  currentProfession: string | null;
  currentEmployer: string | null;
  industry: string | null;
  locationCity: string | null;
  locationCountry: string | null;
  skills: string[] | null;
  bio: string | null;
  isAvailableForMentorship: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  user?: { firstName: string; lastName: string; email: string };
  school?: School;
  yearGroup?: { graduationYear: number; name: string | null };
  linkedinUrl?: string | null;
  websiteUrl?: string | null;
  mentorshipAreas?: string[] | null;
}

export interface EventItem {
  id: string;
  title: string;
  description: string | null;
  eventType: string;
  startDatetime: string;
  endDatetime: string | null;
  locationName: string | null;
  locationAddress: string | null;
  coverPhotoUrl: string | null;
  maxAttendees: number | null;
  ticketPrice: string;
  currency: string;
  school?: School;
  registeredCount?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  category: string;
  targetAmount: string;
  raisedAmount: string;
  currency: string;
  status: string;
  coverPhotoUrl: string | null;
  progressPercentage: number;
  computedProgress?: number;
  contributorCount?: number;
  school?: School;
}

export interface Announcement {
  id: string;
  type: string;
  title: string;
  content: string | null;
  photoUrl: string | null;
  isPinned: boolean;
  publishedAt: string;
  school?: School;
}

export interface Opportunity {
  id: string;
  type: string;
  title: string;
  description: string | null;
  companyName: string | null;
  location: string | null;
  industry: string | null;
  jobType: string | null;
  salaryRange: string | null;
  deadline: string | null;
}

export interface Business {
  id: string;
  name: string;
  description: string | null;
  industry: string | null;
  location: string | null;
  website: string | null;
  logoUrl: string | null;
  isVerified: boolean;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================================
// ADDITIONAL TYPES — Added during code review
// ============================================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  otherNames?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  profilePhotoUrl?: string;
  role: 'student' | 'alumni' | 'teacher' | 'school_admin' | 'super_admin';
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface YearGroup {
  id: string;
  schoolId: string;
  graduationYear: number;
  name: string;
  description?: string;
  coverPhotoUrl?: string;
  createdAt: string;
  school?: School;
  memberCount?: number;
}

export interface School {
  id: string;
  districtId?: string;
  name: string;
  code?: string;
  type?: string;
  establishedYear?: number;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  ticketType?: string;
  ticketCode: string;
  qrCodeUrl?: string;
  paymentStatus: 'pending' | 'confirmed' | 'failed';
  paymentReference?: string;
  amountPaid?: string;
  checkedIn: boolean;
  checkedInAt?: string;
  registeredAt: string;
  event?: EventItem;
}

export interface Contribution {
  id: string;
  projectId: string;
  userId?: string;
  amount: string;
  currency: string;
  paymentMethod?: string;
  paymentReference?: string;
  isAnonymous: boolean;
  message?: string;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: string;
  project?: Project;
}

export interface Application {
  id: string;
  opportunityId: string;
  userId: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'accepted' | 'rejected';
  appliedAt: string;
  opportunity?: Opportunity;
}

export interface MentorshipRequest {
  id: string;
  mentorshipId: string;
  menteeId: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  respondedAt?: string;
  offer?: { area: string };
  mentee?: { firstName: string; lastName: string };
  mentor?: { firstName: string; lastName: string };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'alumni' | 'teacher' | 'school_admin' | 'super_admin';
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface School {
  id: string;
  name: string;
  code?: string;
  type?: string;
  establishedYear?: number;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface YearGroup {
  id: string;
  schoolId: string;
  graduationYear: number;
  name: string;
  description?: string;
  coverPhotoUrl?: string;
  createdAt: string;
  school?: School;
  memberCount?: number;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  ticketCode: string;
  paymentStatus: 'pending' | 'confirmed' | 'failed';
  checkedIn: boolean;
  registeredAt: string;
  event?: EventItem;
}

export interface Contribution {
  id: string;
  projectId: string;
  userId?: string;
  amount: string;
  currency: string;
  isAnonymous: boolean;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: string;
  project?: Project;
}

export interface Application {
  id: string;
  opportunityId: string;
  userId: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'accepted' | 'rejected';
  appliedAt: string;
  opportunity?: Opportunity;
}

export interface MentorshipRequest {
  id: string;
  mentorshipId: string;
  menteeId: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  respondedAt?: string;
  offer?: { area: string };
  mentee?: { firstName: string; lastName: string };
  mentor?: { firstName: string; lastName: string };
}
