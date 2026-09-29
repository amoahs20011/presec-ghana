import Link from 'next/link';
import {
  Briefcase,
  MapPin,
  Globe,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Store,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { GradientCard, GradientCardBody } from '@/components/ui/GradientCard';
import { api } from '@/lib/api';
import type { Business, Paginated } from '@/types';

export const metadata = {
  title: 'Business Directory',
  description:
    'Discover and support businesses owned by PRESEC alumni.',
};

async function getBusinesses(): Promise<Business[]> {
  try {
    const data = await api.get<Paginated<Business>>(
      '/businesses?limit=24',
    );
    return data.items;
  } catch {
    return [];
  }
}

export default async function BusinessesPage() {
  const businesses = await getBusinesses();

  const industries = new Set(
    businesses.map((b) => b.industry).filter(Boolean) as string[],
  );

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative container py-12">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Badge
            color="gold"
            size="lg"
            className="mb-4 bg-gold/20 border-gold/40 text-gold-light"
          >
            <Store className="w-3.5 h-3.5" />
            PRESEC Network
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Alumni{' '}
            <span className="gradient-text-gold">Businesses</span>
          </h1>
          <p className="text-lg text-slate-400 mb-8">
            Support the PRESEC economic network. Discover businesses owned and
            run by fellow alumni.
          </p>
          <ButtonLink
            href="/dashboard/businesses/new"
            variant="gradient"
            iconRight={<ArrowRight className="w-4 h-4" />}
          >
            List Your Business
          </ButtonLink>
        </div>

        {/* STATS */}
        {businesses.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-10 max-w-md mx-auto">
            <GradientCard theme="gold" hover={false}>
              <GradientCardBody className="p-5 text-center">
                <div className="font-display text-3xl font-extrabold text-white mb-1">
                  {businesses.length}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  Businesses
                </div>
              </GradientCardBody>
            </GradientCard>
            <GradientCard theme="emerald" hover={false}>
              <GradientCardBody className="p-5 text-center">
                <div className="font-display text-3xl font-extrabold text-white mb-1">
                  {industries.size}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  Industries
                </div>
              </GradientCardBody>
            </GradientCard>
          </div>
        )}

        {/* EMPTY */}
        {businesses.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800 flex items-center justify-center">
              <Store className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2">
              No businesses yet
            </h3>
            <p className="text-slate-400 mb-6">
              Be the first to list your business in the alumni directory.
            </p>
            <ButtonLink href="/register" variant="gradient">
              Join the Community
            </ButtonLink>
          </div>
        )}

        {/* BUSINESSES GRID */}
        {businesses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business, index) => {
              const themes = [
                'gold',
                'emerald',
                'violet',
                'cyan',
                'sunset',
                'ocean',
              ] as const;
              const theme = themes[index % themes.length];

              const gradientMap = {
                gold: 'from-amber-500 to-orange-500',
                emerald: 'from-emerald-500 to-cyan-500',
                violet: 'from-violet-500 to-pink-500',
                cyan: 'from-cyan-500 to-blue-500',
                sunset: 'from-orange-500 to-pink-500',
                ocean: 'from-blue-500 to-emerald-500',
              };

              const initials = business.name
                .split(' ')
                .slice(0, 2)
                .map((w) => w[0])
                .join('')
                .toUpperCase();

              return (
                <GradientCard
                  key={business.id}
                  theme={theme}
                  className="h-full"
                >
                  <GradientCardBody className="p-6 h-full flex flex-col">
                    {/* Logo / Icon */}
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradientMap[theme]} flex items-center justify-center text-white text-xl font-extrabold shrink-0 shadow-lg overflow-hidden`}
                      >
                        {business.logoUrl ? (
                          <img
                            src={business.logoUrl}
                            alt={business.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          initials
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-lg text-white line-clamp-2">
                          {business.name}
                        </h3>
                        {business.industry && (
                          <div className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5" />
                            {business.industry}
                          </div>
                        )}
                      </div>
                    </div>

                    {business.description && (
                      <p className="text-sm text-slate-400 line-clamp-3 mb-4">
                        {business.description}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="space-y-2 mb-4 flex-1">
                      {business.location && (
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          {business.location}
                        </div>
                      )}
                    </div>

                    {/* Badges + CTA */}
                    <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {business.isVerified && (
                          <Badge color="green" size="sm">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      {business.website && (
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-gold hover:text-gold-light flex items-center gap-1 transition-colors"
                        >
                          Visit
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </GradientCardBody>
                </GradientCard>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 p-10 md:p-14">
          <div className="absolute inset-0 bg-slate-900/40" />
          <div className="relative max-w-2xl">
            <Badge
              color="gold"
              size="lg"
              className="mb-4 bg-white/20 border-white/30 text-white backdrop-blur"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Grow Together
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Own a business?
            </h2>
            <p className="text-lg text-white/90 mb-6">
              List it in the PRESEC alumni directory. Reach thousands of
              alumni, get support from the community, and grow together.
            </p>
            <ButtonLink
              href="/dashboard/businesses/new"
              variant="gradient"
              size="lg"
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              List Your Business
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
