import Link from 'next/link';
import {
  Briefcase,
  MapPin,
  Building2,
  Calendar,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Award,
  BookOpen,
  DollarSign,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { GradientCard, GradientCardBody } from '@/components/ui/GradientCard';
import { api } from '@/lib/api';
import type { Opportunity, Paginated } from '@/types';

export const metadata = {
  title: 'Opportunities',
  description:
    'Jobs, internships, scholarships, and training opportunities for PRESEC alumni and students.',
};

async function getOpportunities(): Promise<Opportunity[]> {
  try {
    const data = await api.get<Paginated<Opportunity>>(
      '/opportunities?limit=24',
    );
    return data.items;
  } catch {
    return [];
  }
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

function typeBadgeColor(
  type: string,
): 'blue' | 'gold' | 'green' | 'purple' | 'sky' | 'red' {
  switch (type) {
    case 'job':
      return 'blue';
    case 'internship':
      return 'purple';
    case 'scholarship':
      return 'green';
    case 'training':
      return 'gold';
    default:
      return 'sky';
  }
}

function typeIcon(type: string) {
  switch (type) {
    case 'job':
      return <Briefcase className="w-3.5 h-3.5" />;
    case 'internship':
      return <TrendingUp className="w-3.5 h-3.5" />;
    case 'scholarship':
      return <Award className="w-3.5 h-3.5" />;
    case 'training':
      return <BookOpen className="w-3.5 h-3.5" />;
    default:
      return <GraduationCap className="w-3.5 h-3.5" />;
  }
}

function gradientMap(theme: string) {
  const map: Record<string, string> = {
    violet: 'from-violet-500 to-pink-500',
    cyan: 'from-cyan-500 to-blue-500',
    gold: 'from-amber-500 to-orange-500',
    emerald: 'from-emerald-500 to-cyan-500',
    sunset: 'from-orange-500 to-pink-500',
    ocean: 'from-blue-500 to-emerald-500',
  };
  return map[theme] || 'from-slate-500 to-slate-700';
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date();
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default async function OpportunitiesPage() {
  const opportunities = await getOpportunities();

  const types = new Set(
    opportunities.map((o) => o.type).filter(Boolean) as string[],
  );

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative container py-12">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Badge
            color="gold"
            size="lg"
            className="mb-4 bg-gold/20 border-gold/40 text-gold-light"
          >
            <Briefcase className="w-3.5 h-3.5" />
            Career Hub
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Find Your{' '}
            <span className="gradient-text-gold">Next Opportunity</span>
          </h1>
          <p className="text-lg text-slate-400 mb-8">
            Jobs, internships, scholarships, and training — curated for the
            PRESEC community.
          </p>
          <ButtonLink
            href="/dashboard/opportunities/new"
            variant="gradient"
            iconRight={<ArrowRight className="w-4 h-4" />}
          >
            Post an Opportunity
          </ButtonLink>
        </div>

        {/* STATS */}
        {opportunities.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-10 max-w-md mx-auto">
            <GradientCard theme="cyan" hover={false}>
              <GradientCardBody className="p-5 text-center">
                <div className="font-display text-3xl font-extrabold text-white mb-1">
                  {opportunities.length}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  Opportunities
                </div>
              </GradientCardBody>
            </GradientCard>
            <GradientCard theme="emerald" hover={false}>
              <GradientCardBody className="p-5 text-center">
                <div className="font-display text-3xl font-extrabold text-white mb-1">
                  {types.size}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  Categories
                </div>
              </GradientCardBody>
            </GradientCard>
          </div>
        )}

        {/* EMPTY */}
        {opportunities.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800 flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2">
              No opportunities yet
            </h3>
            <p className="text-slate-400 mb-6">
              Check back soon for jobs, internships, and scholarships.
            </p>
            <ButtonLink href="/register" variant="gradient">
              Join the Community
            </ButtonLink>
          </div>
        )}

        {/* OPPORTUNITIES GRID */}
        {opportunities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp) => {
              const theme = typeTheme(opp.type);
              const badgeColor = typeBadgeColor(opp.type);
              const gradient = gradientMap(theme);
              const days = daysUntil(opp.deadline);
              const urgent = days !== null && days <= 7 && days >= 0;

              return (
                <Link
                  key={opp.id}
                  href={`/opportunities/${opp.id}`}
                  className="block group"
                >
                  <GradientCard theme={theme} className="h-full">
                    <GradientCardBody className="p-6 h-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          {typeIcon(opp.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Badge color={badgeColor} size="sm" className="mb-2">
                            {opp.type.replace('_', ' ')}
                          </Badge>
                          <h3 className="font-display font-bold text-lg text-white line-clamp-2">
                            {opp.title}
                          </h3>
                        </div>
                      </div>

                      {/* Company */}
                      {opp.companyName && (
                        <div className="flex items-center gap-2 text-sm text-slate-300 mb-3">
                          <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="line-clamp-1">
                            {opp.companyName}
                          </span>
                        </div>
                      )}

                      {/* Description */}
                      {opp.description && (
                        <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                          {opp.description}
                        </p>
                      )}

                      {/* Meta */}
                      <div className="space-y-2 mb-4 flex-1">
                        {opp.location && (
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            {opp.location}
                          </div>
                        )}
                        {opp.jobType && (
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            {opp.jobType}
                          </div>
                        )}
                        {opp.salaryRange && (
                          <div className="flex items-center gap-2 text-sm text-emerald-400 font-semibold">
                            <DollarSign className="w-3.5 h-3.5 shrink-0" />
                            {opp.salaryRange}
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="mt-auto pt-4 border-t border-slate-800">
                        {opp.deadline && (
                          <div
                            className={`flex items-center gap-2 text-xs mb-3 ${
                              urgent
                                ? 'text-red-400 font-semibold'
                                : 'text-slate-500'
                            }`}
                          >
                            <Calendar className="w-3 h-3" />
                            {urgent ? 'Ends in' : 'Deadline:'}{' '}
                            {days !== null && days >= 0
                              ? days === 0
                                ? 'today'
                                : `${days} day${days !== 1 ? 's' : ''}`
                              : new Date(opp.deadline).toLocaleDateString(
                                  'en-GB',
                                  { day: 'numeric', month: 'short' },
                                )}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gold group-hover:gap-1.5 flex items-center gap-1 transition-all">
                            View & Apply
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </GradientCardBody>
                  </GradientCard>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-cyan-600 to-blue-600 p-10 md:p-14">
          <div className="absolute inset-0 bg-slate-900/40" />
          <div className="relative max-w-2xl">
            <Badge
              color="gold"
              size="lg"
              className="mb-4 bg-white/20 border-white/30 text-white backdrop-blur"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Hiring? Sharing?
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Post an opportunity
            </h2>
            <p className="text-lg text-white/90 mb-6">
              Are you hiring? Know of a scholarship or internship? Share it
              with the PRESEC community and help someone&apos;s career.
            </p>
            <ButtonLink
              href="/dashboard/opportunities/new"
              variant="gradient"
              size="lg"
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Post Opportunity
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
