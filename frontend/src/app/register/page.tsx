'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  School as SchoolIcon,
  GraduationCap,
  Briefcase,
  MapPin,
  Check,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError, api } from '@/lib/api';
import type { UserType } from '@/types';

const PROGRAMMES = [
  'General Arts',
  'General Science',
  'Business',
  'Technical',
  'Visual Arts',
  'Home Economics',
];

const TEACHING_POSITIONS = [
  'Teacher',
  'Senior Teacher',
  'Head of Department',
  'Assistant Headmaster',
  'Headmaster',
];

const DEPARTMENTS = [
  'Science',
  'Mathematics',
  'English',
  'Social Studies',
  'ICT',
  'Languages',
  'Administration',
  'Other',
];

interface SchoolOption {
  id: string;
  name: string;
  code?: string;
  district?: {
    name: string;
    region?: { name: string };
  };
}

const STEPS = [
  { id: 1, label: 'Account', icon: User },
  { id: 2, label: 'School', icon: SchoolIcon },
  { id: 3, label: 'Profile', icon: Briefcase },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [step, setStep] = useState(1);
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [schools, setSchools] = useState<SchoolOption[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'past_student',
    schoolId: '',
    programme: '',
    graduationYear: '',
    currentPosition: '',
    department: '',
    currentProfession: '',
    currentEmployer: '',
    locationCity: '',
    bio: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load user types + schools
  useEffect(() => {
    async function loadData() {
      try {
        const [typesRes, schoolsRes] = await Promise.all([
          api.get<UserType[]>('/users/user-types'),
          api.get<SchoolOption[]>('/schools'),
        ]);
        setUserTypes(typesRes);
        setSchools(schoolsRes);
        if (schoolsRes.length > 0 && !form.schoolId) {
          setForm((prev) => ({ ...prev, schoolId: schoolsRes[0].id }));
        }
      } catch (err) {
        console.error('Failed to load registration data', err);
        setError('Failed to load registration data. Please refresh.');
      } finally {
        setLoadingData(false);
      }
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  }

  const selectedType = userTypes.find((t) => t.code === form.userType);
  const category = selectedType?.category || '';

  const isAlumni = category === 'alumni';
  const isStudent = category === 'student';
  const isTeacher = category === 'teacher';

  // Step 1 validation
  function validateStep1(): string | null {
    if (!form.firstName.trim()) return 'First name is required';
    if (!form.lastName.trim()) return 'Last name is required';
    if (!form.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return 'Please enter a valid email';
    }
    if (form.password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (form.password !== form.confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  }

  // Step 2 validation
  function validateStep2(): string | null {
    if (!form.userType) return 'Please select your relationship to PRESEC';
    if (!form.schoolId) return 'Please select your school';
    if (isAlumni) {
      if (!form.graduationYear) return 'Graduation year is required';
      const year = parseInt(form.graduationYear, 10);
      if (year < 1950 || year > 2050) return 'Please enter a valid year';
    }
    return null;
  }

  function handleNext() {
    setError('');
    if (step === 1) {
      const err = validateStep1();
      if (err) return setError(err);
    }
    if (step === 2) {
      const err = validateStep2();
      if (err) return setError(err);
    }
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBack() {
    setError('');
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone || undefined,
        userType: form.userType,
        schoolId: form.schoolId || undefined,
        programme: form.programme || undefined,
        graduationYear: form.graduationYear
          ? parseInt(form.graduationYear, 10)
          : undefined,
        currentPosition: form.currentPosition || undefined,
        department: form.department || undefined,
      });
      router.push('/dashboard/profile');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-text-muted">Loading registration form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-alt py-12">
      <div className="container max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 mb-6"
          >
            <img
              src="/images/presec-logo.png"
              alt="PRESEC"
              className="w-12 h-12 rounded-xl"
            />
            <div className="flex flex-col leading-none text-left">
              <span className="font-display font-extrabold text-xl text-brand">
                PRESEC
              </span>
              <span className="text-2xs font-medium text-gold tracking-widest">
                GHANA
              </span>
            </div>
          </Link>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-text mb-2">
            Create your account
          </h1>
          <p className="text-text-muted">
            Join the PRESEC GHANA community in 3 simple steps
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isDone = step > s.id;
              return (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                        isDone
                          ? 'bg-success text-white'
                          : isActive
                            ? 'bg-gradient-brand text-white shadow-glow-violet'
                            : 'bg-surface border-2 border-border text-text-muted'
                      }`}
                    >
                      {isDone ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-semibold ${
                        isActive
                          ? 'text-brand'
                          : isDone
                            ? 'text-success'
                            : 'text-text-muted'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 -mt-6 transition-all ${
                        step > s.id ? 'bg-success' : 'bg-border'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/30 text-error-dark text-sm flex items-start gap-3 animate-slide-down">
            <div className="w-5 h-5 rounded-full bg-error text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
              !
            </div>
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-border shadow-md p-6 sm:p-8 text-text">
          <form onSubmit={handleSubmit}>
            {/* STEP 1: ACCOUNT */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="First name"
                    value={form.firstName}
                    onChange={(e) => update('firstName', e.target.value)}
                    placeholder="Kwame"
                    icon={<User className="w-4 h-4" />}
                    required
                    fullWidth
                  />
                  <Input
                    label="Last name"
                    value={form.lastName}
                    onChange={(e) => update('lastName', e.target.value)}
                    placeholder="Mensah"
                    icon={<User className="w-4 h-4" />}
                    required
                    fullWidth
                  />
                </div>

                <Input
                  label="Email address"
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@example.com"
                  icon={<Mail className="w-4 h-4" />}
                  required
                  fullWidth
                />

                <Input
                  label="Phone number (optional)"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+233 XX XXX XXXX"
                  icon={<Phone className="w-4 h-4" />}
                  fullWidth
                />

                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="At least 8 characters"
                  icon={<Lock className="w-4 h-4" />}
                  iconRight={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-text-muted hover:text-brand"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  }
                  hint="Use a mix of letters, numbers, and symbols"
                  required
                  fullWidth
                />

                <Input
                  label="Confirm password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  placeholder="Re-enter your password"
                  icon={<Lock className="w-4 h-4" />}
                  required
                  fullWidth
                />
              </div>
            )}

            {/* STEP 2: SCHOOL */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-sm font-semibold text-text mb-3">
                    Your relationship to PRESEC
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {userTypes.map((type) => {
                      const isSelected = form.userType === type.code;
                      return (
                        <button
                          key={type.code}
                          type="button"
                          onClick={() => update('userType', type.code)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            isSelected
                              ? 'border-brand bg-brand/5 shadow-md'
                              : 'border-border hover:border-brand/40 bg-surface'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <span className="font-semibold text-sm text-text">
                              {type.label}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-text-muted leading-relaxed">
                            {type.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Select
                  label="Your PRESEC school"
                  value={form.schoolId}
                  onChange={(e) => update('schoolId', e.target.value)}
                  required
                  fullWidth
                >
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                      {school.district?.name && ` — ${school.district.name}`}
                    </option>
                  ))}
                </Select>

                {isAlumni && (
                  <>
                    <Select
                      label="Programme / Course"
                      value={form.programme}
                      onChange={(e) => update('programme', e.target.value)}
                      fullWidth
                    >
                      <option value="">Select programme (optional)</option>
                      {PROGRAMMES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </Select>

                    <Input
                      label="Graduation year"
                      type="number"
                      value={form.graduationYear}
                      onChange={(e) =>
                        update('graduationYear', e.target.value)
                      }
                      placeholder="2008"
                      icon={<GraduationCap className="w-4 h-4" />}
                      min="1950"
                      max="2050"
                      required
                      fullWidth
                    />
                  </>
                )}

                {isStudent && (
                  <Select
                    label="Programme / Course"
                    value={form.programme}
                    onChange={(e) => update('programme', e.target.value)}
                    fullWidth
                  >
                    <option value="">Select programme</option>
                    {PROGRAMMES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </Select>
                )}

                {isTeacher && (
                  <>
                    <Select
                      label="Current position"
                      value={form.currentPosition}
                      onChange={(e) =>
                        update('currentPosition', e.target.value)
                      }
                      fullWidth
                    >
                      <option value="">Select position</option>
                      {TEACHING_POSITIONS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </Select>

                    <Select
                      label="Department"
                      value={form.department}
                      onChange={(e) => update('department', e.target.value)}
                      fullWidth
                    >
                      <option value="">Select department</option>
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </Select>
                  </>
                )}
              </div>
            )}

            {/* STEP 3: PROFILE */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div className="p-4 rounded-xl bg-brand/5 border border-brand/20 text-sm text-text-secondary flex items-start gap-3 mb-4">
                  <Sparkles className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                  <div>
                    These fields are <strong>optional</strong> — you can add
                    them later from your profile page.
                  </div>
                </div>

                {(isAlumni || isTeacher) && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Current profession"
                      value={form.currentProfession}
                      onChange={(e) =>
                        update('currentProfession', e.target.value)
                      }
                      placeholder="Software Engineer"
                      icon={<Briefcase className="w-4 h-4" />}
                      fullWidth
                    />
                    <Input
                      label="Employer"
                      value={form.currentEmployer}
                      onChange={(e) =>
                        update('currentEmployer', e.target.value)
                      }
                      placeholder="Company name"
                      fullWidth
                    />
                  </div>
                )}

                <Input
                  label="City"
                  value={form.locationCity}
                  onChange={(e) => update('locationCity', e.target.value)}
                  placeholder="Accra"
                  icon={<MapPin className="w-4 h-4" />}
                  fullWidth
                />

                <Textarea
                  label="Short bio"
                  value={form.bio}
                  onChange={(e) => update('bio', e.target.value)}
                  placeholder="Tell us a bit about yourself..."
                  rows={4}
                  hint="You can update this anytime from your profile"
                  fullWidth
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-border">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  variant="gradient"
                  onClick={handleNext}
                  iconRight={<ArrowRight className="w-4 h-4" />}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="gradient"
                  loading={loading}
                  iconRight={<Check className="w-4 h-4" />}
                >
                  Create Account
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-text-muted mt-6">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-brand hover:text-brand-dark underline decoration-2 underline-offset-2"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
