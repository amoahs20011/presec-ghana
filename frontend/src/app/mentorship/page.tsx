import Link from 'next/link';
import {
  Users,
  Award,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BookOpen,
  Heart,
  UserCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { GradientCard, GradientCardBody } from '@/components/ui/GradientCard';
import { api } from '@/lib/api';

export const metadata = {
  title: 'Mentorship',
  description:
    'Connect with experienced PRESEC alumni mentors across industries.',
};

interface MentorshipOffer {
  id: string;
  area: string;
  description: string | null;
  maxMentees: number;
  currentMentees: number;
  mentor?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

async function getOffers(): Promise<MentorshipOffer[]> {
  try {
    return await api.get<MentorshipOffer[]>('/mentorship/offers');
  } catch {
    return [];
  }
}

function offerTheme(
  index: number,
): 'violet' | 'cyan' | 'gold' | 'emerald' | 'sunset' | 'ocean' {
  const themes = [
    'violet',
    'cyan',
    'gold',
    'emerald',
    'sunset',
    'ocean',
  ] as const;
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

export default async function MentorshipPage() {
  const offers = await getOffers();

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
            <Users className="w-3.5 h-3.5" />
            Mentorship Program
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Learn from the{' '}
            <span className="gradient-text-gold">Best of PRESEC</span>
          </h1>
          <p className="text-lg text-slate-400">
            Connect with experienced alumni mentors across every industry.
            Guide the next generation or find your own path forward.
          </p>
        </div>

        {/* HOW IT WORKS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
          <GradientCard theme="violet" hover={false}>
            <GradientCardBody className="p-6 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white">
                <UserCheck className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-white mb-2">
                1. Find a Mentor
              </h3>
              <p className="text-sm text-slate-400">
                Browse experienced alumni in your field of interest
              </p>
            </GradientCardBody>
          </GradientCard>

          <GradientCard theme="cyan" hover={false}>
            <GradientCardBody className="p-6 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-white mb-2">
                2. Reach Out
              </h3>
              <p className="text-sm text-slate-400">
                Send a mentorship request with a personal message
              </p>
            </GradientCardBody>
          </GradientCard>

          <GradientCard theme="gold" hover={false}>
            <GradientCardBody className="p-6 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-white mb-2">
                3. Grow Together
              </h3>
              <p className="text-sm text-slate-400">
                Build a meaningful relationship that lasts for years
              </p>
            </GradientCardBody>
          </GradientCard>
        </div>

        {/* EMPTY STATE */}
        {offers.length === 0 && (
          <div className="text-center py-20 max-w-2xl mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800 flex items-center justify-center">
              <Users className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2">
              No mentors available yet
            </h3>
            <p className="text-slate-400 mb-6">
              Be the first to become a mentor and help shape the next
              generation of PRESEC alumni.
            </p>
            <ButtonLink href="/register" variant="gradient">
              Become a Mentor
            </ButtonLink>
          </div>
        )}

        {/* MENTORS GRID */}
        {offers.length > 0 && (
          <>
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-2">
                Available <span className="gradient-text-gold">Mentors</span>
              </h2>
              <p className="text-slate-400">
                {offers.length} alumni ready to guide you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer, index) => {
                const theme = offerTheme(index);
                const gradient = gradientMap(theme);
                const spotsLeft = offer.maxMentees - offer.currentMentees;
                const initials = offer.mentor
                  ? `${offer.mentor.firstName?.[0] || ''}${
                      offer.mentor.lastName?.[0] || ''
                    }`.toUpperCase()
                  : '?';
                const mentorName = offer.mentor
                  ? `${offer.mentor.firstName} ${offer.mentor.lastName}`
                  : 'Anonymous Mentor';

                return (
                  <GradientCard
                    key={offer.id}
                    theme={theme}
                    className="h-full"
                  >
                    <GradientCardBody className="p-6 h-full flex flex-col">
                      {/* Mentor avatar */}
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-lg`}
                        >
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-bold text-lg text-white line-clamp-1">
                            {mentorName}
                          </h3>
                          <div className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5" />
                            Mentor
                          </div>
                        </div>
                      </div>

                      {/* Area */}
                      <Badge color={theme as any} size="sm" className="mb-3 w-fit">
                        <Briefcase className="w-3 h-3" />
                        {offer.area}
                      </Badge>

                      {/* Description */}
                      {offer.description && (
                        <p className="text-sm text-slate-400 line-clamp-3 mb-4 flex-1">
                          {offer.description}
                        </p>
                      )}

                      {/* Capacity */}
                      <div className="mt-auto pt-4 border-t border-slate-800">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-slate-500">
                            Capacity
                          </span>
                          <span className="text-xs font-semibold text-white">
                            {offer.currentMentees} / {offer.maxMentees}
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
                          <div
                            className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-700`}
                            style={{
                              width: `${
                                (offer.currentMentees / offer.maxMentees) * 100
                              }%`,
                            }}
                          />
                        </div>
                        {spotsLeft > 0 ? (
                          <Badge color="green" size="sm">
                            <CheckCircle2 className="w-3 h-3" />
                            {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
                          </Badge>
                        ) : (
                          <Badge color="red" size="sm">
                            Fully booked
                          </Badge>
                        )}
                      </div>
                    </GradientCardBody>
                  </GradientCard>
                );
              })}
            </div>
          </>
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
              Give Back
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Become a Mentor
            </h2>
            <p className="text-lg text-white/90 mb-6">
              Share your experience with younger alumni and current students.
              Shape the next generation of PRESEC leaders.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink
                href="/register"
                variant="gradient"
                size="lg"
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                Sign Up to Mentor
              </ButtonLink>
              <ButtonLink
                href="/alumni"
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white hover:text-brand bg-white/5 backdrop-blur"
              >
                Browse Alumni
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
