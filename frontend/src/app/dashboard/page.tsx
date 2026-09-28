'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Users,
  Heart,
  Briefcase,
  TrendingUp,
  Award,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Newspaper,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { GradientCard, GradientCardBody, GradientIcon } from '@/components/ui/GradientCard';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { api } from '@/lib/api';
import type {
  Alumni,
  EventItem,
  Project,
  Announcement,
  Registration,
  Contribution,
  Application,
  MentorshipRequest,
} from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  const [alumni, setAlumni] = useState<Alumni | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [asMentor, setAsMentor] = useState<MentorshipRequest[]>([]);
  const [asMentee, setAsMentee] = useState<MentorshipRequest[]>([]);
  const [featuredProject, setFeaturedProject] = useState<Project | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [pinnedNews, setPinnedNews] = useState<Announcement[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || authLoading) return;
    if (!user) {
      router.replace('/login?redirect=/dashboard');
      return;
    }

    async function loadData() {
      setDataLoading(true);
      const results = await Promise.allSettled([
        api.get<Alumni>('/alumni/me', true),
        api.get<Registration[]>('/events/me/registrations', true),
        api.get<Contribution[]>('/projects/me/contributions', true),
        api.get<Application[]>('/opportunities/me/applications', true),
        api.get<MentorshipRequest[]>('/mentorship/requests/as-mentor', true),
        api.get<MentorshipRequest[]>('/mentorship/requests/as-mentee', true),
        api.get<{ items: Project[] }>('/projects?status=active&limit=1'),
        api.get<{ items: EventItem[] }>('/events?limit=2'),
        api.get<{ items: Announcement[] }>('/announcements?isPinned=true&limit=2'),
      ]);

      if (results[0].status === 'fulfilled') setAlumni(results[0].value);
      if (results[1].status === 'fulfilled') setRegistrations(results[1].value);
      if (results[2].status === 'fulfilled') setContributions(results[2].value);
      if (results[3].status === 'fulfilled') setApplications(results[3].value);
      if (results[4].status === 'fulfilled') setAsMentor(results[4].value);
      if (results[5].status === 'fulfilled') setAsMentee(results[5].value);
      if (results[6].status === 'fulfilled')
        setFeaturedProject(results[6].value.items[0] || null);
      if (results[7].status === 'fulfilled')
        setUpcomingEvents(results[7].value.items);
      if (results[8].status === 'fulfilled')
        setPinnedNews(results[8].value.items);

      setDataLoading(false);
    }

    loadData();
  }, [user, authLoading, mounted, router]);

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isAdmin =
    user.role === 'super_admin' || user.role === 'school_admin';
  const completion = calculateCompletion(alumni);

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-light/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative container py-10">
        {/* HEADER */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-1">
              Welcome back, {user.firstName}!
            </h1>
            <p className="text-slate-400 text-sm">{user.email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge color="gold">{user.role.replace('_', ' ')}</Badge>
            {user.isVerified && (
              <Badge color="green">✓ Verified</Badge>
            )}
            {isAdmin && <Badge color="red">ADMIN</Badge>}
          </div>
        </div>

        {/* PROFILE COMPLETION */}
        {alumni && completion.percentage < 100 && (
          <GradientCard theme="cyan" className="mb-8" hover={false}>
            <GradientCardBody className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h2 className="font-display font-bold text-white text-lg mb-1">
                    Profile Completion: {completion.percentage}%
                  </h2>
                  <p className="text-sm text-slate-400">
                    Complete your profile to help classmates find you.
                  </p>
                </div>
                <ButtonLink
                  href="/dashboard/profile"
                  variant="gradient"
                  size="md"
                >
                  Complete Profile
                </ButtonLink>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 rounded-full transition-all duration-700"
                  style={{ width: `${completion.percentage}%` }}
                />
              </div>
            </GradientCardBody>
          </GradientCard>
        )}

        {/* STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Calendar className="w-6 h-6" />}
            value={registrations.length}
            label="Event Registrations"
            theme="cyan"
            href="/events"
          />
          <StatCard
            icon={<Heart className="w-6 h-6" />}
            value={contributions.length}
            label="Contributions"
            theme="violet"
            href="/projects"
          />
          <StatCard
            icon={<Briefcase className="w-6 h-6" />}
            value={applications.length}
            label="Job Applications"
            theme="gold"
            href="/opportunities"
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            value={asMentor.length}
            label="Mentorship Requests"
            theme="emerald"
            href="/mentorship"
          />
        </div>

        {/* ALUMNI PROFILE CARD */}
        {alumni ? (
          <GradientCard theme="violet" className="mb-8" hover={false}>
            <GradientCardBody className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display font-bold text-white text-xl">
                      {user.firstName} {user.lastName}
                    </h2>
                    {alumni.currentProfession && (
                      <p className="text-sm text-slate-400 mt-1">
                        {alumni.currentProfession}
                        {alumni.currentEmployer &&
                          ` at ${alumni.currentEmployer}`}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {alumni.graduationYear && (
                        <Badge color="blue">
                          Class of {alumni.graduationYear}
                        </Badge>
                      )}
                      {alumni.programme && (
                        <Badge color="gold">{alumni.programme}</Badge>
                      )}
                      {alumni.locationCity && (
                        <Badge color="sky">
                          📍 {alumni.locationCity}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Link
                  href="/dashboard/profile"
                  className="text-sm font-semibold text-gold hover:text-gold-light"
                >
                  Edit Profile →
                </Link>
              </div>
            </GradientCardBody>
          </GradientCard>
        ) : (
          <GradientCard theme="gold" className="mb-8" hover={false}>
            <GradientCardBody className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-bold text-white text-lg mb-1">
                    Complete Your Profile
                  </h2>
                  <p className="text-sm text-slate-400">
                    Create your alumni profile to appear in the directory.
                  </p>
                </div>
                <ButtonLink
                  href="/dashboard/profile"
                  variant="gradient"
                  size="md"
                >
                  Create Profile
                </ButtonLink>
              </div>
            </GradientCardBody>
          </GradientCard>
        )}

        {/* FEATURED PROJECT + EVENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {featuredProject && (
            <GradientCard theme="emerald" hover={false}>
              <GradientCardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <GradientIcon theme="emerald" size="sm">
                      <Building2 className="w-5 h-5" />
                    </GradientIcon>
                    <h3 className="font-display font-bold text-white">
                      Featured Project
                    </h3>
                  </div>
                  <Link
                    href="/projects"
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    All Projects →
                  </Link>
                </div>
                <h4 className="font-semibold text-white text-lg mb-2">
                  {featuredProject.title}
                </h4>
                <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                  {featuredProject.description}
                </p>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-white">
                      GH₵ {Number(featuredProject.raisedAmount).toLocaleString()}
                    </span>
                    <span className="text-slate-400">
                      of GH₵ {Number(featuredProject.targetAmount).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(
                          featuredProject.computedProgress ||
                            featuredProject.progressPercentage ||
                            0,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <ButtonLink
                  href={`/projects/${featuredProject.id}`}
                  variant="gradient"
                  size="sm"
                  fullWidth
                >
                  Support This Project
                </ButtonLink>
              </GradientCardBody>
            </GradientCard>
          )}

          <GradientCard theme="cyan" hover={false}>
            <GradientCardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <GradientIcon theme="cyan" size="sm">
                    <Calendar className="w-5 h-5" />
                  </GradientIcon>
                  <h3 className="font-display font-bold text-white">
                    Upcoming Events
                  </h3>
                </div>
                <Link
                  href="/events"
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  All Events →
                </Link>
              </div>
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-slate-400">No upcoming events.</p>
              ) : (
                <ul className="space-y-3">
                  {upcomingEvents.slice(0, 3).map((event) => (
                    <li
                      key={event.id}
                      className="border-b border-slate-800 last:border-0 pb-3 last:pb-0"
                    >
                      <Link
                        href={`/events/${event.id}`}
                        className="font-medium text-white hover:text-cyan-400 transition-colors block"
                      >
                        {event.title}
                      </Link>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(event.startDatetime).toLocaleDateString(
                            'en-GB',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            },
                          )}
                        </span>
                        {event.locationName && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.locationName}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </GradientCardBody>
          </GradientCard>
        </div>

        {/* NEWS + MENTORSHIP */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {pinnedNews.length > 0 && (
            <GradientCard theme="gold" hover={false}>
              <GradientCardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <GradientIcon theme="gold" size="sm">
                      <Newspaper className="w-5 h-5" />
                    </GradientIcon>
                    <h3 className="font-display font-bold text-white">
                      Pinned Announcements
                    </h3>
                  </div>
                  <Link
                    href="/news"
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    All News →
                  </Link>
                </div>
                <ul className="space-y-3">
                  {pinnedNews.map((a) => (
                    <li
                      key={a.id}
                      className="border-b border-slate-800 last:border-0 pb-3 last:pb-0"
                    >
                      <Link
                        href={`/news/${a.id}`}
                        className="font-medium text-white hover:text-amber-400 transition-colors block"
                      >
                        {a.title}
                      </Link>
                      <div className="text-xs text-slate-400 mt-1">
                        {a.type} •{' '}
                        {new Date(a.publishedAt).toLocaleDateString('en-GB')}
                      </div>
                    </li>
                  ))}
                </ul>
              </GradientCardBody>
            </GradientCard>
          )}

          <GradientCard theme="sunset" hover={false}>
            <GradientCardBody className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <GradientIcon theme="sunset" size="sm">
                  <Award className="w-5 h-5" />
                </GradientIcon>
                <h3 className="font-display font-bold text-white">
                  Mentorship
                </h3>
              </div>
              {alumni?.isAvailableForMentorship ? (
                <>
                  <Badge color="green" className="mb-3">
                    <CheckCircle2 className="w-3 h-3" />
                    Available as Mentor
                  </Badge>
                  {asMentor.length > 0 ? (
                    <div>
                      <p className="text-sm text-slate-400 mb-3">
                        You have <strong className="text-white">{asMentor.length}</strong> request(s) waiting.
                      </p>
                      <ButtonLink
                        href="/mentorship"
                        variant="outline"
                        size="sm"
                      >
                        View Requests
                      </ButtonLink>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">
                      No pending requests. Your offer is listed.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm text-slate-400 mb-3">
                    Become a mentor to guide younger alumni and students.
                  </p>
                  <ButtonLink
                    href="/mentorship"
                    variant="gradient"
                    size="sm"
                  >
                    Become a Mentor
                  </ButtonLink>
                </>
              )}
            </GradientCardBody>
          </GradientCard>
        </div>

        {/* ADMIN SHORTCUT */}
        {isAdmin && (
          <GradientCard theme="gold" className="mb-8" hover={false}>
            <GradientCardBody className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <GradientIcon theme="gold" size="md">
                    <Award className="w-6 h-6" />
                  </GradientIcon>
                  <div>
                    <h3 className="font-display font-bold text-white">
                      Admin Panel
                    </h3>
                    <p className="text-sm text-slate-400">
                      Manage users, verify alumni, review content.
                    </p>
                  </div>
                </div>
                <ButtonLink href="/admin" variant="gradient">
                  Open Admin Panel
                </ButtonLink>
              </div>
            </GradientCardBody>
          </GradientCard>
        )}

        {/* QUICK LINKS */}
        <div>
          <h3 className="font-display font-bold text-white text-lg mb-4">
            Quick Links
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickLink href="/alumni" label="Alumni Directory" icon={<Users className="w-5 h-5" />} theme="violet" />
            <QuickLink href="/events" label="Browse Events" icon={<Calendar className="w-5 h-5" />} theme="cyan" />
            <QuickLink href="/projects" label="Projects" icon={<Heart className="w-5 h-5" />} theme="emerald" />
            <QuickLink href="/opportunities" label="Opportunities" icon={<Briefcase className="w-5 h-5" />} theme="gold" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SUB-COMPONENTS
   ============================================================ */

function StatCard({
  icon,
  value,
  label,
  theme,
  href,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  theme: 'violet' | 'cyan' | 'gold' | 'emerald' | 'sunset' | 'ocean';
  href: string;
}) {
  return (
    <GradientCard href={href} theme={theme}>
      <GradientCardBody className="p-5 text-center">
        <div className="flex justify-center mb-3">
          <GradientIcon theme={theme} size="md">
            {icon}
          </GradientIcon>
        </div>
        <div className="font-display text-3xl font-extrabold text-white mb-1">
          {value}
        </div>
        <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
          {label}
        </div>
      </GradientCardBody>
    </GradientCard>
  );
}

function QuickLink({
  href,
  label,
  icon,
  theme,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  theme: 'violet' | 'cyan' | 'gold' | 'emerald' | 'sunset' | 'ocean';
}) {
  return (
    <GradientCard href={href} theme={theme}>
      <GradientCardBody className="p-5 text-center">
        <div className="flex justify-center mb-3">
          <GradientIcon theme={theme} size="md">
            {icon}
          </GradientIcon>
        </div>
        <div className="text-sm font-semibold text-white">{label}</div>
      </GradientCardBody>
    </GradientCard>
  );
}

function calculateCompletion(alumni: Alumni | null) {
  if (!alumni) {
    return { percentage: 0, missing: ['profile not created'] };
  }

  const fields = [
    { value: alumni.programme, label: 'programme' },
    { value: alumni.graduationYear, label: 'graduation year' },
    { value: alumni.currentProfession, label: 'profession' },
    { value: alumni.currentEmployer, label: 'employer' },
    { value: alumni.industry, label: 'industry' },
    { value: alumni.locationCity, label: 'city' },
    { value: alumni.skills && alumni.skills.length > 0, label: 'skills' },
    { value: alumni.bio, label: 'bio' },
  ];

  const filled = fields.filter((f) => f.value).length;
  const missing = fields.filter((f) => !f.value).map((f) => f.label);

  return {
    percentage: Math.round((filled / fields.length) * 100),
    missing,
  };
}
