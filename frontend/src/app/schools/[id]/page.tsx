import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Building2,
  Calendar,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  Award,
  Users,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { GradientCard, GradientCardBody, GradientIcon } from '@/components/ui/GradientCard';
import { api } from '@/lib/api';
import type { School } from '@/types';
import { notFound } from 'next/navigation';

async function getSchool(id: string): Promise<School | null> {
  try {
    return await api.get<School>(`/schools/${id}`);
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
  const school = await getSchool(id);
  return { title: school?.name || 'School Not Found' };
}

export default async function SchoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const school = await getSchool(id);

  if (!school) notFound();

  const region = school.district?.region?.name;
  const districtName = school.district?.name;

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
              href="/schools"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-gold transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Schools
            </Link>

            <div className="flex flex-wrap items-start gap-6">
              {/* Logo */}
              <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-3xl bg-gradient-to-br from-violet-500 via-pink-500 to-amber-500 flex items-center justify-center text-white shadow-2xl shrink-0 overflow-hidden">
                {school.logoUrl ? (
                  <img
                    src={school.logoUrl}
                    alt={school.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-12 h-12" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-[280px]">
                <div className="flex flex-wrap gap-2 mb-3">
                  {school.code && (
                    <Badge
                      color="gray"
                      size="md"
                      className="bg-slate-800/80 border-slate-700 text-slate-300 font-mono"
                    >
                      {school.code}
                    </Badge>
                  )}
                  {school.type && (
                    <Badge color="gold" size="md">
                      {school.type}
                    </Badge>
                  )}
                  {school.isActive && (
                    <Badge color="green" size="md">
                      Active
                    </Badge>
                  )}
                </div>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3">
                  {school.name}
                </h1>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  {region && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Globe className="w-4 h-4 text-gold" />
                      {region} Region
                    </div>
                  )}
                  {districtName && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4 text-gold" />
                      {districtName} District
                    </div>
                  )}
                  {school.establishedYear && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="w-4 h-4 text-gold" />
                      Founded {school.establishedYear}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="container py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT: Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              {school.description && (
                <GradientCard theme="violet" hover={false}>
                  <GradientCardBody className="p-6">
                    <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-3">
                      <GradientIcon theme="violet" size="sm">
                        <Building2 className="w-5 h-5" />
                      </GradientIcon>
                      About this School
                    </h2>
                    <p className="text-slate-300 whitespace-pre-line leading-relaxed">
                      {school.description}
                    </p>
                  </GradientCardBody>
                </GradientCard>
              )}

              {/* Contact info */}
              {(school.address ||
                school.phone ||
                school.email ||
                school.website) && (
                <GradientCard theme="cyan" hover={false}>
                  <GradientCardBody className="p-6">
                    <h2 className="font-display text-xl font-bold text-white mb-5 flex items-center gap-3">
                      <GradientIcon theme="cyan" size="sm">
                        <Phone className="w-5 h-5" />
                      </GradientIcon>
                      Contact Information
                    </h2>

                    <div className="space-y-4">
                      {school.address && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                              Address
                            </div>
                            <div className="text-sm text-slate-200">
                              {school.address}
                            </div>
                          </div>
                        </div>
                      )}

                      {school.phone && (
                        <div className="flex items-start gap-3">
                          <Phone className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                              Phone
                            </div>
                            <a
                              href={`tel:${school.phone}`}
                              className="text-sm text-slate-200 hover:text-cyan-400 transition-colors"
                            >
                              {school.phone}
                            </a>
                          </div>
                        </div>
                      )}

                      {school.email && (
                        <div className="flex items-start gap-3">
                          <Mail className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                              Email
                            </div>
                            <a
                              href={`mailto:${school.email}`}
                              className="text-sm text-slate-200 hover:text-cyan-400 transition-colors"
                            >
                              {school.email}
                            </a>
                          </div>
                        </div>
                      )}

                      {school.website && (
                        <div className="flex items-start gap-3">
                          <Globe className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                              Website
                            </div>
                            <a
                              href={school.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-slate-200 hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5"
                            >
                              Visit website
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </GradientCardBody>
                </GradientCard>
              )}
            </div>

            {/* RIGHT: Quick info + CTA */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-4">
                <GradientCard theme="gold" hover={false}>
                  <GradientCardBody className="p-6">
                    <h3 className="font-display text-lg font-bold text-white mb-5">
                      Quick Info
                    </h3>

                    <dl className="space-y-4">
                      {school.code && (
                        <div>
                          <dt className="text-2xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                            School Code
                          </dt>
                          <dd className="text-sm text-slate-200 font-mono">
                            {school.code}
                          </dd>
                        </div>
                      )}

                      {school.type && (
                        <div>
                          <dt className="text-2xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                            Type
                          </dt>
                          <dd className="text-sm text-slate-200 capitalize">
                            {school.type}
                          </dd>
                        </div>
                      )}

                      {school.establishedYear && (
                        <div>
                          <dt className="text-2xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                            Established
                          </dt>
                          <dd className="text-sm text-slate-200 flex items-center gap-2">
                            <Award className="w-3.5 h-3.5 text-slate-500" />
                            {school.establishedYear}
                          </dd>
                        </div>
                      )}

                      {region && (
                        <div>
                          <dt className="text-2xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                            Region
                          </dt>
                          <dd className="text-sm text-slate-200 flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-slate-500" />
                            {region}
                          </dd>
                        </div>
                      )}

                      {districtName && (
                        <div>
                          <dt className="text-2xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                            District
                          </dt>
                          <dd className="text-sm text-slate-200 flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            {districtName}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </GradientCardBody>
                </GradientCard>

                {/* CTA */}
                <GradientCard theme="violet" hover={false}>
                  <GradientCardBody className="p-6 text-center">
                    <GradientIcon theme="violet" size="md" className="mx-auto mb-3">
                      <GraduationCap className="w-6 h-6" />
                    </GradientIcon>
                    <h4 className="font-semibold text-white mb-1">
                      Studied here?
                    </h4>
                    <p className="text-sm text-slate-400 mb-4">
                      Join this school&apos;s community
                    </p>
                    <ButtonLink
                      href="/register"
                      variant="gradient"
                      size="sm"
                      fullWidth
                    >
                      Connect with Alumni
                    </ButtonLink>
                  </GradientCardBody>
                </GradientCard>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-pink-600 to-amber-500 p-10 md:p-14">
            <div className="absolute inset-0 bg-slate-900/40" />
            <div className="relative max-w-2xl">
              <Badge
                color="gold"
                size="lg"
                className="mb-4 bg-white/20 border-white/30 text-white backdrop-blur"
              >
                <Users className="w-3.5 h-3.5" />
                Find Your Classmates
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Reconnect with {school.name}
              </h2>
              <p className="text-lg text-white/90 mb-6">
                Find alumni from your school, reconnect with old classmates,
                and give back to your alma mater.
              </p>
              <ButtonLink
                href="/alumni"
                variant="gradient"
                size="lg"
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                Browse Alumni
              </ButtonLink>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
