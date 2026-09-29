import Link from 'next/link';
import {
  Home,
  Users,
  Search,
  ArrowRight,
  Compass,
  BookOpen,
} from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { GradientCard, GradientCardBody } from '@/components/ui/GradientCard';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden flex items-center justify-center py-20">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative container max-w-4xl">
        <div className="text-center">
          {/* Big 404 */}
          <div className="font-display text-8xl sm:text-9xl lg:text-[10rem] font-extrabold gradient-text-neon leading-none mb-6">
            404
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Page Not Found
          </h1>

          <p className="text-lg text-slate-400 mb-10 max-w-lg mx-auto">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
            It may have been moved or removed.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-16">
            <ButtonLink
              href="/"
              variant="gradient"
              size="lg"
              icon={<Home className="w-4 h-4" />}
            >
              Go Home
            </ButtonLink>
            <ButtonLink
              href="/alumni"
              variant="outline"
              size="lg"
              icon={<Users className="w-4 h-4" />}
            >
              Browse Alumni
            </ButtonLink>
          </div>

          {/* Suggested pages */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <span className="text-sm text-slate-500 uppercase tracking-wider font-semibold">
                Or explore these pages
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  href: '/events',
                  label: 'Events',
                  icon: <Compass className="w-5 h-5" />,
                  theme: 'violet' as const,
                },
                {
                  href: '/projects',
                  label: 'Projects',
                  icon: <BookOpen className="w-5 h-5" />,
                  theme: 'emerald' as const,
                },
                {
                  href: '/opportunities',
                  label: 'Opportunities',
                  icon: <Search className="w-5 h-5" />,
                  theme: 'cyan' as const,
                },
                {
                  href: '/about',
                  label: 'About Us',
                  icon: <Users className="w-5 h-5" />,
                  theme: 'gold' as const,
                },
              ].map((page) => (
                <Link key={page.href} href={page.href} className="group block">
                  <GradientCard theme={page.theme}>
                    <GradientCardBody className="p-5 text-center">
                      <div className="flex justify-center mb-3">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientMap(
                            page.theme,
                          )} flex items-center justify-center text-white shadow-lg`}
                        >
                          {page.icon}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {page.label}
                      </div>
                    </GradientCardBody>
                  </GradientCard>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
