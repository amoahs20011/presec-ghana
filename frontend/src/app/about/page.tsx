import Link from 'next/link';
import {
  Users,
  BookOpen,
  Rocket,
  Heart,
  Sparkles,
  Target,
  Award,
  ArrowRight,
  Building2,
  Globe,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { GradientCard, GradientCardBody } from '@/components/ui/GradientCard';
import { Logo } from '@/components/ui/Logo';

export const metadata = {
  title: 'About',
  description:
    'Learn about PRESEC GHANA — the digital home of Presbyterian Secondary School alumni, students, and staff across Ghana.',
};

const values = [
  {
    title: 'Community',
    description:
      'Bringing together all PRESEC generations under one platform.',
    icon: <Users className="w-6 h-6" />,
    theme: 'violet' as const,
  },
  {
    title: 'Heritage',
    description: 'Preserving and celebrating our shared history.',
    icon: <BookOpen className="w-6 h-6" />,
    theme: 'gold' as const,
  },
  {
    title: 'Opportunity',
    description:
      'Creating pathways for personal and professional growth.',
    icon: <Rocket className="w-6 h-6" />,
    theme: 'cyan' as const,
  },
  {
    title: 'Transparency',
    description:
      'Open tracking of projects, donations, and school development.',
    icon: <Target className="w-6 h-6" />,
    theme: 'emerald' as const,
  },
  {
    title: 'Excellence',
    description:
      'Upholding the high standards that define PRESEC alumni.',
    icon: <Award className="w-6 h-6" />,
    theme: 'sunset' as const,
  },
  {
    title: 'Service',
    description:
      'Giving back to our schools and communities across Ghana.',
    icon: <Heart className="w-6 h-6" />,
    theme: 'ocean' as const,
  },
];

const stats = [
  {
    label: 'Alumni Members',
    value: '500+',
    icon: <Users className="w-6 h-6" />,
    theme: 'violet' as const,
  },
  {
    label: 'Regions Covered',
    value: '16',
    icon: <Globe className="w-6 h-6" />,
    theme: 'cyan' as const,
  },
  {
    label: 'Active Schools',
    value: '1',
    icon: <Building2 className="w-6 h-6" />,
    theme: 'gold' as const,
  },
  {
    label: 'Year Groups',
    value: '20+',
    icon: <GraduationCap className="w-6 h-6" />,
    theme: 'emerald' as const,
  },
];

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

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative container py-12">
        {/* HERO */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge
            color="gold"
            size="lg"
            className="mb-4 bg-gold/20 border-gold/40 text-gold-light"
          >
            <Sparkles className="w-3.5 h-3.5" />
            About PRESEC GHANA
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            One Community.
            <br />
            Many Generations.
            <br />
            <span className="gradient-text-gold">One Future.</span>
          </h1>
          <p className="text-lg text-slate-300 mb-6 max-w-2xl mx-auto">
            PRESEC GHANA is the digital home of Presbyterian Secondary School
            alumni, students, teachers, and friends across Ghana&apos;s 16
            regions. We connect the past, present, and future of our beloved
            institution.
          </p>
          <p className="text-sm font-medium italic text-gold mb-8">
            &ldquo;In Lumine Tuo Videbimus Lumen&rdquo;
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink
              href="/register"
              variant="gradient"
              size="lg"
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Join the Community
            </ButtonLink>
            <ButtonLink href="/schools" variant="outline" size="lg">
              Explore Schools
            </ButtonLink>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto">
          {stats.map((stat) => (
            <GradientCard key={stat.label} theme={stat.theme} hover={false}>
              <GradientCardBody className="p-5 text-center">
                <div
                  className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${gradientMap(
                    stat.theme,
                  )} flex items-center justify-center text-white shadow-lg`}
                >
                  {stat.icon}
                </div>
                <div className="font-display text-3xl font-extrabold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </GradientCardBody>
            </GradientCard>
          ))}
        </div>

        {/* MISSION & VISION */}
        <div className="grid md:grid-cols-2 gap-6 mb-16 max-w-5xl mx-auto">
          <GradientCard theme="violet" hover={false}>
            <GradientCardBody className="p-8">
              <div className="w-14 h-14 mb-5 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white">
                <Target className="w-7 h-7" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white mb-4">
                Our Mission
              </h2>
              <p className="text-slate-300 leading-relaxed">
                To create a unified digital home for the entire PRESEC
                community — preserving history, enabling connections,
                creating opportunities, and supporting school development
                across Ghana.
              </p>
            </GradientCardBody>
          </GradientCard>

          <GradientCard theme="cyan" hover={false}>
            <GradientCardBody className="p-8">
              <div className="w-14 h-14 mb-5 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                <Briefcase className="w-7 h-7" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white mb-4">
                Our Vision
              </h2>
              <p className="text-slate-300 leading-relaxed">
                A thriving PRESEC network that spans generations and
                continents — where every alumnus stays connected, every
                student finds mentorship, and every school grows through
                alumni support.
              </p>
            </GradientCardBody>
          </GradientCard>
        </div>

        {/* VALUES */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <Badge color="gold" className="mb-3">
              <Award className="w-3.5 h-3.5" />
              Our Values
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              What <span className="gradient-text-gold">Drives Us</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <GradientCard
                key={value.title}
                theme={value.theme}
                hover={false}
              >
                <GradientCardBody className="p-6">
                  <div
                    className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${gradientMap(
                      value.theme,
                    )} flex items-center justify-center text-white shadow-lg`}
                  >
                    {value.icon}
                  </div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {value.description}
                  </p>
                </GradientCardBody>
              </GradientCard>
            ))}
          </div>
        </div>

        {/* WHAT WE DO */}
        <div className="mb-16 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <Badge color="violet" className="mb-3">
              <Users className="w-3.5 h-3.5" />
              What We Do
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              Everything PRESEC{' '}
              <span className="gradient-text-gold">In One Place</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Connect Alumni',
                description:
                  'Reconnect with classmates across generations, industries, and continents.',
              },
              {
                title: 'Support Students',
                description:
                  'Provide mentorship, scholarships, and career guidance to current students.',
              },
              {
                title: 'Fund Projects',
                description:
                  'Support transparent school development with real-time progress tracking.',
              },
              {
                title: 'Preserve Heritage',
                description:
                  'Archive our history — photos, documents, achievements, and stories.',
              },
              {
                title: 'Create Opportunities',
                description:
                  'Share jobs, internships, scholarships, and business opportunities.',
              },
              {
                title: 'Build Community',
                description:
                  'Organize reunions, events, and get-togethers that bring us together.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-brand flex items-center justify-center text-white shrink-0 text-sm font-bold">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-pink-600 to-amber-500 p-10 md:p-14">
          <div className="absolute inset-0 bg-slate-900/40" />
          <div className="relative max-w-2xl">
            <Badge
              color="gold"
              size="lg"
              className="mb-4 bg-white/20 border-white/30 text-white backdrop-blur"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Join Us
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Be part of our story
            </h2>
            <p className="text-lg text-white/90 mb-6">
              Whether you&apos;re a recent graduate or a long-time alumnus,
              there&apos;s a place for you in PRESEC GHANA. Join thousands of
              alumni reconnecting and giving back.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink
                href="/register"
                variant="gradient"
                size="lg"
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                Create Account
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
