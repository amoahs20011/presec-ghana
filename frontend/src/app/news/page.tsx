import Link from 'next/link';
import {
  Newspaper,
  Calendar,
  ArrowRight,
  Sparkles,
  Award,
  Heart,
  PartyPopper,
  TrendingUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { GradientCard, GradientCardBody } from '@/components/ui/GradientCard';
import { api } from '@/lib/api';
import type { Announcement, Paginated } from '@/types';

export const metadata = {
  title: 'News',
  description: 'Latest news and announcements from the PRESEC community.',
};

async function getNews(): Promise<Announcement[]> {
  try {
    const data = await api.get<Paginated<Announcement>>(
      '/announcements?limit=24',
    );
    return data.items;
  } catch {
    return [];
  }
}

function typeIcon(type: string) {
  switch (type) {
    case 'achievement':
      return <Award className="w-4 h-4" />;
    case 'memorial':
    case 'condolence':
      return <Heart className="w-4 h-4" />;
    case 'birth':
    case 'wedding':
      return <PartyPopper className="w-4 h-4" />;
    case 'news':
      return <TrendingUp className="w-4 h-4" />;
    default:
      return <Newspaper className="w-4 h-4" />;
  }
}

function typeTheme(
  type: string,
): 'violet' | 'cyan' | 'gold' | 'emerald' | 'sunset' | 'ocean' {
  switch (type) {
    case 'achievement':
      return 'gold';
    case 'memorial':
    case 'condolence':
      return 'violet';
    case 'birth':
    case 'wedding':
      return 'sunset';
    case 'news':
      return 'cyan';
    default:
      return 'emerald';
  }
}

function typeBadgeColor(
  type: string,
): 'gold' | 'blue' | 'green' | 'gray' | 'sky' | 'purple' | 'red' | 'yellow' {
  switch (type) {
    case 'achievement':
      return 'gold';
    case 'memorial':
    case 'condolence':
      return 'gray';
    case 'birth':
    case 'wedding':
      return 'purple';
    case 'news':
      return 'sky';
    default:
      return 'blue';
  }
}

export default async function NewsPage() {
  const news = await getNews();

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative container py-12">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge
            color="gold"
            size="lg"
            className="mb-4 bg-gold/20 border-gold/40 text-gold-light"
          >
            <Newspaper className="w-3.5 h-3.5" />
            Community News
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4">
            News &amp;{' '}
            <span className="gradient-text-gold">Announcements</span>
          </h1>
          <p className="text-lg text-slate-400">
            Stay informed about our growing community — achievements, events,
            and milestones.
          </p>
        </div>

        {/* EMPTY */}
        {news.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800 flex items-center justify-center">
              <Newspaper className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2">
              No news yet
            </h3>
            <p className="text-slate-400 mb-6">
              Check back soon for updates from the community.
            </p>
            <ButtonLink href="/" variant="gradient">
              Back to Home
            </ButtonLink>
          </div>
        )}

        {/* NEWS GRID */}
        {news.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, index) => {
              const theme = typeTheme(item.type);
              const badgeColor = typeBadgeColor(item.type);

              return (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className="block group"
                >
                  <GradientCard theme={theme} className="h-full">
                    <GradientCardBody className="p-6 h-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <Badge color={badgeColor} size="sm">
                          {typeIcon(item.type)}
                          <span className="ml-1">
                            {item.type || 'News'}
                          </span>
                        </Badge>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.publishedAt).toLocaleDateString(
                            'en-GB',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            },
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-display font-bold text-lg text-white mb-3 line-clamp-2 group-hover:text-gold transition-colors">
                        {item.title}
                      </h3>

                      {/* Excerpt */}
                      {item.content && (
                        <p className="text-sm text-slate-400 line-clamp-3 mb-4 flex-1">
                          {item.content}
                        </p>
                      )}

                      {/* Read more */}
                      <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-semibold text-gold group-hover:gap-1.5 flex items-center gap-1 transition-all">
                          Read more
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
              Share Your Story
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Have news to share?
            </h2>
            <p className="text-lg text-white/90 mb-6">
              Achievements, weddings, births, milestones — let the community
              celebrate with you.
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
