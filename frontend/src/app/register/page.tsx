'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError, api } from '@/lib/api';
import type { UserType, School } from '@/types';

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

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'past_student', // default
    schoolId: '',
    programme: '',
    graduationYear: '',
    currentPosition: '',
    department: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load user types + schools
  useEffect(() => {
    async function load() {
      try {
        const [typesRes, schoolsRes] = await Promise.all([
          api.get<UserType[]>('/users/user-types'),
          api.get<School[]>('/schools'),
        ]);
        setUserTypes(typesRes);
        setSchools(schoolsRes);

        // Auto-default school to PRESEC Tema C11 if only one
        if (schoolsRes.length > 0 && !form.schoolId) {
          setForm((prev) => ({ ...prev, schoolId: schoolsRes[0].id }));
        }
      } catch (err) {
        console.error('Failed to load registration data', err);
      } finally {
        setLoadingData(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Determine what fields to show
  const selectedType = userTypes.find((t) => t.code === form.userType);
  const category = selectedType?.category || '';

  const isStudentOrAlumni =
    category === 'student' || category === 'alumni';
  const isTeacherLike =
    category === 'teacher' ||
    category === 'headmaster' ||
    category === 'staff';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

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
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Unable to register. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-presec-bg-alt">
        <div className="text-center">
          <div className="text-presec-text-muted">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 bg-presec-bg-alt">
      <div className="container max-w-2xl">
        <Card>
          <CardBody>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-presec-gold rounded-full mx-auto flex items-center justify-center font-bold text-presec-blue-dark text-xl">
                P
              </div>
              <h1 className="mt-4 text-2xl font-bold text-presec-blue">
                Join PRESEC GHANA
              </h1>
              <p className="mt-1 text-sm text-presec-text-muted">
                Reconnect with classmates and join the community
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* WHO ARE YOU? */}
              <div>
                <label className="block text-sm font-semibold text-presec-text mb-2">
                  Who are you? <span className="text-presec-error">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {userTypes.map((type) => (
                    <button
                      key={type.code}
                      type="button"
                      onClick={() => update('userType', type.code)}
                      className={`text-left px-3 py-2 rounded-md border transition-all text-sm ${
                        form.userType === type.code
                          ? 'border-presec-blue bg-presec-blue text-white'
                          : 'border-presec-border bg-white hover:border-presec-blue'
                      }`}
                    >
                      <div className="font-medium">{type.label}</div>
                      <div
                        className={`text-xs mt-0.5 ${
                          form.userType === type.code
                            ? 'text-gray-200'
                            : 'text-presec-text-muted'
                        }`}
                      >
                        {type.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* BASIC INFO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name *"
                  required
                  value={form.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                  placeholder="Kwame"
                  autoComplete="given-name"
                />
                <Input
                  label="Last Name *"
                  required
                  value={form.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  placeholder="Mensah"
                  autoComplete="family-name"
                />
              </div>

              <Input
                label="Email *"
                type="email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />

              <Input
                label="Phone (optional)"
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="+233200000000"
                autoComplete="tel"
              />

              {/* SCHOOL SELECTION */}
              <div>
                <label className="block text-sm font-semibold text-presec-text mb-2">
                  PRESEC School *
                </label>
                <select
                  className="w-full px-3 py-2 border border-presec-border rounded-md focus:outline-none focus:ring-2 focus:ring-presec-blue"
                  value={form.schoolId}
                  onChange={(e) => update('schoolId', e.target.value)}
                  required
                >
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* STUDENT / ALUMNI FIELDS */}
              {isStudentOrAlumni && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-presec-text mb-2">
                        Programme
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-presec-border rounded-md focus:outline-none focus:ring-2 focus:ring-presec-blue"
                        value={form.programme}
                        onChange={(e) => update('programme', e.target.value)}
                      >
                        <option value="">Select programme</option>
                        {PROGRAMMES.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Input
                      label={
                        form.userType === 'past_student'
                          ? 'Graduation Year'
                          : 'Expected Graduation Year'
                      }
                      type="number"
                      min={1950}
                      max={2100}
                      value={form.graduationYear}
                      onChange={(e) =>
                        update('graduationYear', e.target.value)
                      }
                      placeholder={form.userType === 'past_student' ? '2008' : '2028'}
                    />
                  </div>
                </>
              )}

              {/* TEACHER/STAFF FIELDS */}
              {isTeacherLike && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-presec-text mb-2">
                        Position
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-presec-border rounded-md focus:outline-none focus:ring-2 focus:ring-presec-blue"
                        value={form.currentPosition}
                        onChange={(e) =>
                          update('currentPosition', e.target.value)
                        }
                      >
                        <option value="">Select position</option>
                        {TEACHING_POSITIONS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-presec-text mb-2">
                        Department
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-presec-border rounded-md focus:outline-none focus:ring-2 focus:ring-presec-blue"
                        value={form.department}
                        onChange={(e) =>
                          update('department', e.target.value)
                        }
                      >
                        <option value="">Select department</option>
                        {DEPARTMENTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* PASSWORD */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Password *"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                />
                <Input
                  label="Confirm Password *"
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) =>
                    update('confirmPassword', e.target.value)
                  }
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-presec-error px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="text-xs text-presec-text-muted bg-presec-bg-alt p-3 rounded-md">
                ℹ️ <strong>Verification:</strong> Your account will be reviewed
                by an administrator. You&apos;ll receive verified status once
                your information is confirmed.
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-presec-text-muted">
                Already have an account?{' '}
              </span>
              <Link
                href="/login"
                className="font-semibold text-presec-blue hover:underline"
              >
                Login
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
