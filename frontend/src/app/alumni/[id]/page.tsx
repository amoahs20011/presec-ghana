import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  GraduationCap,
  Mail,
  Globe,
  CheckCircle2,
  Award,
  Building2,
  Users,
  BookOpen,
  Link2,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import {
  GradientCard,
  GradientCardBody,
  GradientIcon,
} from '@/components/ui/GradientCard';
import { api } from '@/lib/api';
import type { Alumni } from '@/types';
import { notFound } from 'next/navigation';

async function getAlumni(id: string): Promise<Alumni | null> {
  try {
    return await api.get<Alumni>(`/alumni/${id}`);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = await getAlumni(id);
  const name = person?.user
    ? `${person.user.firstName} ${person.user.lastName}`
    : 'Alumni Profile';
  return { title: name };
}

export default async function AlumniDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = await getAlumni(id);

  if (!person) notFound();

  const fullName = person.user
    ? `${person.user.firstName} ${person.user.lastName}`
    : 'Anonymous Alumni';

  const initials = person.user
    ? `${person.user.firstName?.[0] || ''}${
        person.user.lastName?.[0] || ''
      }`.toUpperCase()
    : '?';

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#172554] via-[#1E3A8A] to-[#0F172A] py-16">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />

          <div className="container relative">
            <Link
              href="/alumni"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-gold transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Directory
            </Link>

            <div className="flex flex-wrap items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-3xl bg-gradient-to-br from-violet-500 via-pink-500 to-amber-500 flex items-center justify-center text-white text-4xl font-extrabold shadow-2xl shrink-0">
                {initials}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-[280px]">
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3">
                  {fullName}
                </h1>

                {person.currentProfession && (
                  <p className="text-lg text-slate-300 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-gold" />
                    {person.currentProfession}
                    {person.currentEmployer &&
                      ` at ${person.currentEmployer}`}
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  {person.graduationYear && (
                    <Badge color="blue">
                      <GraduationCap className="w-3 h-3" />
                      Class of {person.graduationYear}
                    </Badge>
                  )}
                  {person.programme && (
                    <Badge color="gold">{person.programme}</Badge>
                  )}
                  {person.locationCity && (
                    <Badge color="sky">
                      <MapPin className="w-3 h-3" />
                      {person.locationCity}
                    </Badge>
                  )}
                  {person.verificationStatus === 'verified' && (
                    <Badge color="green">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </Badge>
                  )}
                  {person.isAvailableForMentorship && (
                    <Badge color="white">
                      <Award className="w-3 h-3" />
                      Available for Mentorship
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT: Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              {person.bio && (
                <GradientCard theme="violet" hover={false}>
                  <GradientCardBody className="p-6">
                    <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-3">
                      <GradientIcon theme="violet" size="sm">
                        <BookOpen className="w-5 h-5" />
                      </GradientIcon>
                      About
                    </h2>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                      {person.bio}
                    </p>
                  </GradientCardBody>
                </GradientCard>
              )}

              {/* Skills */}
              {person.skills && person.skills.length > 0 && (
                <GradientCard theme="cyan" hover={false}>
                  <GradientCardBody className="p-6">
                    <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-3">
                      <GradientIcon theme="cyan" size="sm">
                        <Award className="w-5 h-5" />
                      </GradientIcon>
                      Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {person.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-sm text-slate-200 hover:border-cyan-500 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </GradientCardBody>
                </GradientCard>
              )}

              {/* Mentorship Areas */}
              {person.mentorshipAreas &&
                person.mentorshipAreas.length > 0 && (
                  <GradientCard theme="gold" hover={false}>
                    <GradientCardBody className="p-6">
                      <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-3">
                        <GradientIcon theme="gold" size="sm">
                          <Users className="w-5 h-5" />
                        </GradientIcon>
                        Mentorship Areas
                      </h2>
                      <div className="flex flex-wrap gap-2 mb-5">
                        {person.mentorshipAreas.map((area) => (
                          <Badge key={area} color="gold" size="md">
                            {area}
                          </Badge>
                        ))}
                      </div>
                      <ButtonLink
                        href="/mentorship"
                        variant="gradient"
                        size="sm"
                      >
                        Request Mentorship
                      </ButtonLink>
                    </GradientCardBody>
                  </GradientCard>
                )}
            </div>

            {/* RIGHT: Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-4">
                {/* Quick Info */}
                <GradientCard theme="emerald" hover={false}>
                  <GradientCardBody className="p-6">
                    <h3 className="font-display text-lg font-bold text-white mb-5">
                      Quick Info
                    </h3>

                    <dl className="space-y-4">
                      {person.school?.name && (
                        <div>
                          <dt className="text-2xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                            School
                          </dt>
                          <dd className="text-sm text-slate-200 flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5 text-slate-500" />
                            {person.school.name}
                          </dd>
                        </div>
                      )}

                      {person.graduationYear && (
                        <div>
                          <dt className="text-2xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                            Year Group
                          </dt>
                          <dd className="text-sm text-slate-200 flex items-center gap-2">
                            <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                            {person.graduationYear} Year Group
                          </dd>
                        </div>
                      )}

                      {person.industry && (
                        <div>
                          <dt className="text-2xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                            Industry
                          </dt>
                          <dd className="text-sm text-slate-200">
                            {person.industry}
                          </dd>
                        </div>
                      )}

                      {person.locationCity && (
                        <div>
                          <dt className="text-2xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                            Location
                          </dt>
                          <dd className="text-sm text-slate-200 flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            {person.locationCity}
                            {person.locationCountry &&
                              `, ${person.locationCountry}`}
                          </dd>
                        </div>
                      )}
                    </dl>

                    {/* Social Links */}
                    {(person.linkedinUrl || person.websiteUrl) && (
                      <div className="mt-6 pt-5 border-t border-slate-800 flex gap-2">
                        {person.linkedinUrl && (
                          <a
                            href={person.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-blue-500 transition-colors text-sm"
                          >
                            <Link2 className="w-4 h-4" />
                            LinkedIn
                          </a>
                        )}
                        {person.websiteUrl && (
                          <a
                            href={person.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-emerald-500 transition-colors text-sm"
                          >
                            <Globe className="w-4 h-4" />
                            Website
                          </a>
                        )}
                      </div>
                    )}
                  </GradientCardBody>
                </GradientCard>

                {/* Want to Connect — in sidebar */}
                <GradientCard theme="violet" hover={false}>
                  <GradientCardBody className="p-6 text-center">
                    <GradientIcon
                      theme="violet"
                      size="md"
                      className="mx-auto mb-3"
                    >
                      <Mail className="w-6 h-6" />
                    </GradientIcon>
                    <h4 className="font-semibold text-white mb-1">
                      Want to connect?
                    </h4>
                    <p className="text-sm text-slate-400 mb-4">
                      Reach out through the platform
                    </p>
                    <ButtonLink
                      href="/login"
                      variant="outline"
                      size="sm"
                      fullWidth
                    >
                      Sign in to Contact
                    </ButtonLink>
                  </GradientCardBody>
                </GradientCard>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
