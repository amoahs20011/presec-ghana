import Link from 'next/link';
import {
  Building2,
  MapPin,
  Award,
  ArrowRight,
  Users,
  BookOpen,
  Globe,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { GradientCard, GradientCardBody } from '@/components/ui/GradientCard';
import { api } from '@/lib/api';
import type { School } from '@/types';

export const metadata = {
  title: 'Schools',
  description:
    'Directory of all PRESEC (Presbyterian Secondary School) branches across Ghana.',
};

async function getSchools(): Promise<School[]> {
  try {
    const data = await api.get<School[]>('/schools');
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function schoolTheme(
  index: number,
): 'violet' | 'cyan' | 'gold' | 'emerald' | 'sunset' | 'ocean' {
  const themes = ['violet', 'cyan', 'gold', 'emerald', 'sunset', 'ocean'] as const;
  return themes[index % themes.length];
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

export default async function SchoolsPage() {
  const schools = await getSchools();

  const regions = new Set(
    schools
      .map((s) => s.district?.region?.name)
      .filter(Boolean) as string[],
  );
  const districts = new Set(
    schools.map((s) => s.district?.name).filter(Boolean) as string[],
  );

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative container py-12">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge
            color="gold"
            size="lg"
            className="mb-4 bg-gold/20 border-gold/40 text-gold-light"
          >
            <Building2 className="w-3.5 h-3.5" />
            PRESEC Schools
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Across{' '}
            <span className="gradient-text-gold">16 Regions of Ghana</span>
          </h1>
          <p className="text-lg text-slate-400">
            Every PRESEC branch — a network of excellence, tradition, and
            community.
          </p>
        </div>

        {/* STATS */}
        {schools.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
            <GradientCard theme="violet" hover={false}>
              <GradientCardBody className="p-5 text-center">
                <div className="font-display text-3xl font-extrabold text-white mb-1">
                  {schools.length}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  Schools
                </div>
              </GradientCardBody>
            </GradientCard>
            <GradientCard theme="cyan" hover={false}>
              <GradientCardBody className="p-5 text-center">
                <div className="font-display text-3xl font-extrabold text-white mb-1">
                  {regions.size}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  Regions
                </div>
              </GradientCardBody>
            </GradientCard>
            <GradientCard theme="gold" hover={false}>
              <GradientCardBody className="p-5 text-center">
                <div className="font-display text-3xl font-extrabold text-white mb-1">
                  {districts.size}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  Districts
                </div>
              </GradientCardBody>
            </GradientCard>
          </div>
        )}

        {/* EMPTY */}
        {schools.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800 flex items-center justify-center">
              <Building2 className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2">
              No schools found
            </h3>
            <p className="text-slate-400 mb-6">
              Check back soon as we onboard more PRESEC branches.
            </p>
            <ButtonLink href="/" variant="gradient">
              Back to Home
            </ButtonLink>
          </div>
        )}

        {/* SCHOOLS GRID */}
        {schools.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school, index) => {
              const theme = schoolTheme(index);
              const gradient = gradientMap(theme);

              return (
                <Link
                  key={school.id}
                  href={`/schools/${school.id}`}
                  className="block group"
                >
                  <GradientCard theme={theme} className="h-full">
                    <GradientCardBody className="p-6 h-full flex flex-col">
                      {/* Logo / Icon */}
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          {school.logoUrl ? (
                            <img
                              src={school.logoUrl}
                              alt={school.name}
                              className="w-full h-full rounded-2xl object-cover"
                            />
                          ) : (
                            <Building2 className="w-8 h-8" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-bold text-lg text-white line-clamp-2">
                            {school.name}
                          </h3>
                          {school.code && (
                            <div className="text-xs text-slate-500 mt-1 font-mono">
                              {school.code}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="space-y-2 mb-4 flex-1">
                        {school.district?.region?.name && (
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            {school.district.region.name} Region
                          </div>
                        )}
                        {school.district?.name && (
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            {school.district.name} District
                          </div>
                        )}
                        {school.establishedYear && (
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Award className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            Established {school.establishedYear}
                          </div>
                        )}
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {school.type && (
                          <Badge color={theme as any} size="sm">
                            {school.type}
                          </Badge>
                        )}
                        {school.isActive && (
                          <Badge color="green" size="sm">
                            Active
                          </Badge>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-semibold text-gold group-hover:gap-1.5 flex items-center gap-1 transition-all">
                          View School
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </GradientCardBody>
                  </GradientCard>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-pink-600 to-amber-500 p-10 md:p-14">
          <div className="absolute inset-0 bg-slate-900/40" />
          <div className="relative max-w-2xl">
            <Badge
              color="gold"
              size="lg"
              className="mb-4 bg-white/20 border-white/30 text-white backdrop-blur"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Growing Network
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
              More schools joining soon
            </h2>
            <p className="text-lg text-white/90 mb-6">
              We&apos;re adding more PRESEC branches across Ghana. Register to
              stay updated and connect with your school community.
            </p>
            <ButtonLink
              href="/register"
              variant="gradient"
              size="lg"
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Join the Community
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
