import Link from 'next/link';
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Building2,
  Calendar,
  DollarSign,
  Clock,
  Users,
  Mail,
  ExternalLink,
  Award,
  GraduationCap,
  BookOpen,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Share2,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { GradientCard, GradientCardBody, GradientIcon } from '@/components/ui/GradientCard';
import { api } from '@/lib/api';
import type { Opportunity } from '@/types';
import { notFound } from 'next/navigation';

async function getOpportunity(id: string): Promise<Opportunity | null> {
  try {
    return await api.get<Opportunity>(`/opportunities/${id}`);
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
  const opp = await getOpportunity(id);
  return { title: opp?.title || 'Opportunity Not Found' };
}

function typeTheme(
  type: string,
): 'violet' | 'cyan' | 'gold' | 'emerald' | 'sunset' | 'ocean' {
  switch (type) {
    case 'job':
      return 'cyan';
    case 'internship':
      return 'violet';
    case 'scholarship':
      return 'emerald';
    case 'training':
      return 'gold';
    default:
      return 'sunset';
  }
}

function typeIcon(type: string) {
  switch (type) {
    case 'job':
      return <Briefcase className="w-5 h-5" />;
    case 'internship':
      return <TrendingUp className="w-5 h-5" />;
    case 'scholarship':
      return <Award className="w-5 h-5" />;
    case 'training':
      return <BookOpen className="w-5 h-5" />;
    default:
      return <GraduationCap className="w-5 h-5" />;
  }
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date();
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opp = await getOpportunity(id);

  if (!opp) notFound();

  const theme = typeTheme(opp.type);
  const days = daysUntil(opp.deadline);
  const urgent = days !== null && days <= 7 && days >= 0;
  const expired = days !== null && days < 0;

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#172554] via-[#1E3A8A] to-[#0F172A] py-16">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />

          <div className="container relative">
            <Link
              href="/opportunities"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-gold transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Opportunities
            </Link>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge
                color="gold"
                size="md"
                className="bg-gold/20 border-gold/40 text-gold-light"
              >
                {typeIcon(opp.type)}
                <span className="ml-1.5">{opp.type.replace('_', ' ')}</span>
              </Badge>
              {urgent && !expired && (
                <Badge color="red" size="md">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="ml-1.5">
                    Ending in {days} day{days !== 1 ? 's' : ''}
                  </span>
                </Badge>
              )}
              {expired && (
                <Badge color="gray" size="md">
                  Closed
                </Badge>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 max-w-4xl">
              {opp.title}
            </h1>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {opp.companyName && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Building2 className="w-4 h-4 text-gold" />
                  {opp.companyName}
                </div>
              )}
              {opp.location && (
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-gold" />
                  {opp.location}
                </div>
              )}
              {opp.jobType && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-4 h-4 text-gold" />
                  {opp.jobType}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="container py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT: Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <GradientCard theme={theme} hover={false}>
                <GradientCardBody className="p-6">
                  <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <GradientIcon theme={theme} size="sm">
                      {typeIcon(opp.type)}
                    </GradientIcon>
                    About this Opportunity
                  </h2>
                  {opp.description ? (
                    <p className="text-slate-300 whitespace-pre-line leading-relaxed">
                      {opp.description}
                    </p>
                  ) : (
                    <p className="text-slate-400 italic">
                      No description provided yet.
                    </p>
                  )}
                </GradientCardBody>
              </GradientCard>

              {/* Details */}
              <GradientCard theme="cyan" hover={false}>
                <GradientCardBody className="p-6">
                  <h2 className="font-display text-xl font-bold text-white mb-5 flex items-center gap-3">
                    <GradientIcon theme="cyan" size="sm">
                      <Briefcase className="w-5 h-5" />
                    </GradientIcon>
                    Details
                  </h2>

                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {opp.companyName && (
                      <div>
                        <dt className="text-2xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                          Company
                        </dt>
                        <dd className="text-sm text-slate-200 flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          {opp.companyName}
                        </dd>
                      </div>
                    )}

                    {opp.industry && (
                      <div>
                        <dt className="text-2xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                          Industry
                        </dt>
                        <dd className="text-sm text-slate-200">
                          {opp.industry}
                        </dd>
                      </div>
                    )}

                    {opp.location && (
                      <div>
                        <dt className="text-2xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                          Location
                        </dt>
                        <dd className="text-sm text-slate-200 flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          {opp.location}
                        </dd>
                      </div>
                    )}

                    {opp.jobType && (
                      <div>
                        <dt className="text-2xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                          Job Type
                        </dt>
                        <dd className="text-sm text-slate-200 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {opp.jobType}
                        </dd>
                      </div>
                    )}

                    {opp.salaryRange && (
                      <div>
                        <dt className="text-2xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                          Salary Range
                        </dt>
                        <dd className="text-sm text-emerald-400 font-semibold flex items-center gap-2">
                          <DollarSign className="w-3.5 h-3.5" />
                          {opp.salaryRange}
                        </dd>
                      </div>
                    )}

                    {opp.deadline && (
                      <div>
                        <dt className="text-2xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                          Deadline
                        </dt>
                        <dd
                          className={`text-sm flex items-center gap-2 ${
                            urgent && !expired
                              ? 'text-red-400 font-semibold'
                              : 'text-slate-200'
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(opp.deadline).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </dd>
                      </div>
                    )}
                  </dl>
                </GradientCardBody>
              </GradientCard>
            </div>

            {/* RIGHT: Apply card */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-4 z-10">
                <GradientCard theme="gold" hover={false}>
                  <GradientCardBody className="p-6 text-center">
                    <GradientIcon theme="gold" size="md" className="mx-auto mb-4">
                      {typeIcon(opp.type)}
                    </GradientIcon>

                    <h3 className="font-display text-xl font-bold text-white mb-2">
                      {expired ? 'Applications Closed' : 'Ready to Apply?'}
                    </h3>
                    <p className="text-sm text-slate-400 mb-6">
                      {expired
                        ? 'This opportunity is no longer accepting applications.'
                        : 'Submit your application before the deadline.'}
                    </p>

                    {!expired && (
                      <>
                        <ButtonLink
                          href={`/opportunities/${opp.id}/apply`}
                          variant="gradient"
                          size="lg"
                          fullWidth
                          icon={<Sparkles className="w-4 h-4" />}
                        >
                          Apply Now
                        </ButtonLink>

                        <p className="text-xs text-slate-500 mt-3">
                          Login required
                        </p>
                      </>
                    )}

                    <button
                      type="button"
                      className="mt-5 w-full flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white transition-colors py-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </GradientCardBody>
                </GradientCard>

                {/* Trust badges */}
                <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Verified opportunity
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    From trusted source
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Community-endorsed
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 relative z-0 overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600 via-blue-600 to-violet-600 p-10 md:p-14">
            <div className="absolute inset-0 bg-slate-900/40" />
            <div className="relative max-w-2xl">
              <Badge
                color="gold"
                size="lg"
                className="mb-4 bg-white/20 border-white/30 text-white backdrop-blur"
              >
                <Briefcase className="w-3.5 h-3.5" />
                Explore More
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
                More opportunities await
              </h2>
              <p className="text-lg text-white/90 mb-6">
                Browse jobs, internships, scholarships, and training
                opportunities from the PRESEC community.
              </p>
              <ButtonLink
                href="/opportunities"
                variant="gradient"
                size="lg"
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                Browse All
              </ButtonLink>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
