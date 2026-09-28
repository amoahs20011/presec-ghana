'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { api } from '@/lib/api';
import type {
  Alumni,
  EventItem,
  Opportunity,
  Project,
  Announcement,
  Registration,
  Contribution,
  Application,
  MentorshipRequest,
  User,
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

  // Ensure client hydration complete before routing
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
        api.get<{ items: Announcement[] }>(
          '/announcements?isPinned=true&limit=2',
        ),
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

      // Log failures for debugging
      results.forEach((r, i) => {
        if (r.status === 'rejected') {
          console.error(`Dashboard API call ${i} failed:`, r.reason);
        }
      });

      setDataLoading(false);
    }

    loadData();
  }, [user, authLoading, mounted, router]);

  if (!mounted || authLoading) {
    return (
      <div className="container py-20 text-center text-presec-text-muted">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const completion = calculateCompletion(alumni);
  const isAdmin =
    user.role === 'super_admin' || user.role === 'school_admin';

  return (
    <>
      <section className="bg-presec-blue text-white py-12">
        <div className="container">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome, {user.firstName}!
              </h1>
              <p className="mt-1 text-gray-200">{user.email}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge color="gold">{user.role.replace('_', ' ')}</Badge>
              {user.isVerified && <Badge color="green">✓ Verified</Badge>}
              {isAdmin && <Badge color="red">ADMIN</Badge>}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-presec-bg-alt min-h-[60vh]">
        <div className="container space-y-8">
          {alumni && completion.percentage < 100 && (
            <Card>
              <CardBody>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="font-bold text-presec-blue">
                      Profile Completion: {completion.percentage}%
                    </h2>
                    <p className="text-sm text-presec-text-muted mt-1">
                      Complete your profile to help classmates find you.
                    </p>
                    {completion.missing.length > 0 && (
                      <p className="text-xs text-presec-text-muted mt-2">
                        Missing: {completion.missing.join(', ')}
                      </p>
                    )}
                  </div>
                  <ButtonLink href="/dashboard/profile">
                    Complete Profile
                  </ButtonLink>
                </div>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-presec-gold h-2 rounded-full transition-all"
                    style={{ width: `${completion.percentage}%` }}
                  />
                </div>
              </CardBody>
            </Card>
          )}

          <div>
            {!alumni ? (
              <Card>
                <CardBody className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="font-bold text-presec-blue text-lg">
                      Complete Your Profile
                    </h2>
                    <p className="mt-1 text-sm text-presec-text-muted">
                      Create your alumni profile to appear in the directory
                      and connect with classmates.
                    </p>
                  </div>
                  <ButtonLink href="/dashboard/profile">
                    Create Profile
                  </ButtonLink>
                </CardBody>
              </Card>
            ) : (
              <Card>
                <CardBody>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="font-bold text-presec-blue text-lg">
                        {user.firstName} {user.lastName}
                      </h2>
                      {alumni.currentProfession && (
                        <p className="text-sm text-presec-text-muted mt-1">
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
                          <Badge color="blue">📍 {alumni.locationCity}</Badge>
                        )}
                        {alumni.verificationStatus === 'verified' ? (
                          <Badge color="green">✓ Verified</Badge>
                        ) : alumni.verificationStatus === 'pending' ? (
                          <Badge color="yellow">Pending Review</Badge>
                        ) : (
                          <Badge color="red">Rejected</Badge>
                        )}
                      </div>
                      {alumni.skills && alumni.skills.length > 0 && (
                        <div className="mt-3">
                          <div className="text-xs text-presec-text-muted mb-1">
                            Skills
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {alumni.skills.slice(0, 6).map((skill) => (
                              <span
                                key={skill}
                                className="text-xs bg-presec-bg-alt px-2 py-1 rounded"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <Link
                      href="/dashboard/profile"
                      className="text-sm font-semibold text-presec-blue hover:underline"
                    >
                      Edit Profile →
                    </Link>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>

          {alumni?.yearGroup && (
            <Card>
              <CardBody>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-presec-text-muted uppercase tracking-wide mb-1">
                      Your Year Group
                    </div>
                    <h2 className="font-bold text-presec-blue text-xl">
                      🎓 {alumni.yearGroup.name}
                    </h2>
                    <p className="mt-1 text-sm text-presec-text-muted">
                      Graduated in {alumni.yearGroup.graduationYear} from{' '}
                      {alumni.school?.name}
                    </p>
                  </div>
                  <ButtonLink
                    href={`/alumni?year=${alumni.yearGroup.graduationYear}`}
                    variant="outline"
                  >
                    View Year Group
                  </ButtonLink>
                </div>
              </CardBody>
            </Card>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardBody className="text-center">
                <div className="text-3xl font-bold text-presec-blue">
                  {registrations.length}
                </div>
                <div className="mt-1 text-xs text-presec-text-muted">
                  Event Registrations
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="text-center">
                <div className="text-3xl font-bold text-presec-blue">
                  {contributions.length}
                </div>
                <div className="mt-1 text-xs text-presec-text-muted">
                  Contributions
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="text-center">
                <div className="text-3xl font-bold text-presec-blue">
                  {applications.length}
                </div>
                <div className="mt-1 text-xs text-presec-text-muted">
                  Job Applications
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="text-center">
                <div className="text-3xl font-bold text-presec-blue">
                  {asMentor.length}
                </div>
                <div className="mt-1 text-xs text-presec-text-muted">
                  Mentorship Requests
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredProject && (
              <Card>
                <CardBody>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-presec-blue">
                      🏗️ Featured Project
                    </h3>
                    <Link
                      href="/projects"
                      className="text-xs text-presec-blue hover:underline"
                    >
                      All Projects →
                    </Link>
                  </div>
                  <h4 className="font-semibold text-presec-blue">
                    {featuredProject.title}
                  </h4>
                  <p className="text-sm text-presec-text-muted mt-1 line-clamp-2">
                    {featuredProject.description}
                  </p>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold">
                        GHS{' '}
                        {Number(
                          featuredProject.raisedAmount,
                        ).toLocaleString()}
                      </span>
                      <span className="text-presec-text-muted">
                        of GHS{' '}
                        {Number(
                          featuredProject.targetAmount,
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-presec-gold h-3 rounded-full transition-all"
                        style={{
                          width: `${
                            featuredProject.computedProgress ||
                            featuredProject.progressPercentage ||
                            0
                          }%`,
                        }}
                      />
                    </div>
                    <div className="mt-2 text-xs text-presec-text-muted">
                      {featuredProject.computedProgress ||
                        featuredProject.progressPercentage ||
                        0}
                      % funded
                    </div>
                  </div>
                  <ButtonLink
                    href={`/projects/${featuredProject.id}`}
                    className="mt-4 w-full"
                  >
                    Support This Project
                  </ButtonLink>
                </CardBody>
              </Card>
            )}

            <Card>
              <CardBody>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-presec-blue">
                    📅 Upcoming Events
                  </h3>
                  <Link
                    href="/events"
                    className="text-xs text-presec-blue hover:underline"
                  >
                    All Events →
                  </Link>
                </div>
                {upcomingEvents.length === 0 ? (
                  <p className="text-sm text-presec-text-muted">
                    No upcoming events.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <li
                        key={event.id}
                        className="border-b border-presec-border last:border-0 pb-3 last:pb-0"
                      >
                        <Link
                          href={`/events/${event.id}`}
                          className="font-medium text-presec-blue hover:underline"
                        >
                          {event.title}
                        </Link>
                        <div className="text-xs text-presec-text-muted mt-1">
                          📅{' '}
                          {new Date(event.startDatetime).toLocaleDateString(
                            'en-GB',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            },
                          )}
                          {event.locationName && ` • 📍 ${event.locationName}`}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardBody>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pinnedNews.length > 0 && (
              <Card>
                <CardBody>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-presec-blue">
                      📌 Pinned Announcements
                    </h3>
                    <Link
                      href="/news"
                      className="text-xs text-presec-blue hover:underline"
                    >
                      All News →
                    </Link>
                  </div>
                  <ul className="space-y-3">
                    {pinnedNews.map((a) => (
                      <li
                        key={a.id}
                        className="border-b border-presec-border last:border-0 pb-3 last:pb-0"
                      >
                        <Link
                          href={`/news/${a.id}`}
                          className="font-medium text-presec-blue hover:underline"
                        >
                          {a.title}
                        </Link>
                        <div className="text-xs text-presec-text-muted mt-1">
                          {a.type} •{' '}
                          {new Date(a.publishedAt).toLocaleDateString('en-GB')}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            )}

            <Card>
              <CardBody>
                <h3 className="font-bold text-presec-blue mb-3">
                  🤝 Mentorship
                </h3>
                {alumni?.isAvailableForMentorship ? (
                  <>
                    <Badge color="green">✓ Available as Mentor</Badge>
                    {asMentor.length > 0 ? (
                      <div className="mt-3">
                        <div className="text-sm text-presec-text-muted mb-2">
                          You have {asMentor.length} request(s) waiting.
                        </div>
                        <ButtonLink
                          href="/mentorship"
                          variant="outline"
                          size="sm"
                        >
                          View Requests
                        </ButtonLink>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-presec-text-muted">
                        No pending requests. Your offer is listed.
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-sm text-presec-text-muted">
                      Become a mentor to guide younger alumni and students.
                    </p>
                    <ButtonLink
                      href="/mentorship"
                      className="mt-3"
                      size="sm"
                    >
                      Become a Mentor
                    </ButtonLink>
                  </>
                )}
                {asMentee.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-presec-border">
                    <div className="text-xs text-presec-text-muted uppercase mb-1">
                      As Mentee
                    </div>
                    <div className="text-sm">
                      {asMentee.length} mentorship request(s) sent.
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {isAdmin && (
            <Card className="border-2 border-presec-gold">
              <CardBody>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-presec-blue">
                      🛡️ Admin Panel
                    </h3>
                    <p className="text-sm text-presec-text-muted mt-1">
                      Manage users, verify alumni, review content, and monitor
                      the platform.
                    </p>
                  </div>
                  <ButtonLink href="/admin">Open Admin Panel</ButtonLink>
                </div>
              </CardBody>
            </Card>
          )}

          <div>
            <h3 className="font-bold text-presec-blue text-lg mb-4">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { href: '/alumni', label: 'Alumni Directory', icon: '👥' },
                { href: '/events', label: 'Browse Events', icon: '📅' },
                { href: '/projects', label: 'Projects', icon: '🏗️' },
                { href: '/opportunities', label: 'Opportunities', icon: '💼' },
              ].map((link) => (
                <Link key={link.href} href={link.href}>
                  <Card hover>
                    <CardBody className="text-center">
                      <div className="text-3xl">{link.icon}</div>
                      <div className="mt-2 text-sm font-medium text-presec-blue">
                        {link.label}
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function calculateCompletion(
  alumni: Alumni | null,
): { percentage: number; missing: string[] } {
  if (!alumni) {
    return {
      percentage: 0,
      missing: ['profile not created'],
    };
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
