import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Newspaper,
  Share2,
  Award,
  Heart,
  PartyPopper,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { GradientCard, GradientCardBody, GradientIcon } from '@/components/ui/GradientCard';
import { api } from '@/lib/api';
import type { Announcement } from '@/types';
import { notFound } from 'next/navigation';

async function getNewsItem(id: string): Promise<Announcement | null> {
  try {
    return await api.get<Announcement>(`/announcements/${id}`);
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
  const item = await getNewsItem(id);
  return { title: item?.title || 'News Not Found' };
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

function typeIcon(type: string) {
  switch (type) {
    case 'achievement':
      return <Award className="w-3.5 h-3.5" />;
    case 'memorial':
    case 'condolence':
      return <Heart className="w-3.5 h-3.5" />;
    case 'birth':
    case 'wedding':
      return <PartyPopper className="w-3.5 h-3.5" />;
    case 'news':
      return <TrendingUp className="w-3.5 h-3.5" />;
    default:
      return <Newspaper className="w-3.5 h-3.5" />;
  }
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getNewsItem(id);

  if (!item) notFound();

  const theme = typeTheme(item.type);

  const publishedDate = new Date(item.publishedAt).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#172554] via-[#1E3A8A] to-[#0F172A] py-16">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />

          <div className="container relative max-w-4xl">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-gold transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to News
            </Link>

            <div className="flex flex-wrap gap-3 mb-5">
              <Badge
                color="gold"
                size="md"
                className="bg-gold/20 border-gold/40 text-gold-light"
              >
                {typeIcon(item.type)}
                <span className="ml-1.5">
                  {item.type || 'News'}
                </span>
              </Badge>
              <Badge
                color="gray"
                size="md"
                className="bg-slate-800/80 border-slate-700 text-slate-300"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="ml-1.5">{publishedDate}</span>
              </Badge>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              {item.title}
            </h1>
          </div>
        </section>

        {/* CONTENT */}
        <section className="container py-12 max-w-4xl">
          {/* Cover */}
          {item.photoUrl && (
            <div className="mb-8 rounded-2xl overflow-hidden border border-white/10">
              <img
                src={item.photoUrl}
                alt={item.title}
                className="w-full h-64 lg:h-96 object-cover"
              />
            </div>
          )}

          {/* Body */}
          <GradientCard theme={theme} hover={false}>
            <GradientCardBody className="p-8 md:p-10">
              {item.content ? (
                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="text-slate-200 whitespace-pre-line leading-relaxed text-lg">
                    {item.content}
                  </p>
                </div>
              ) : (
                <p className="text-slate-400 italic">
                  No content available for this announcement.
                </p>
              )}
            </GradientCardBody>
          </GradientCard>

          {/* Share / Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-gold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All news
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-gold transition-colors text-sm"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          {/* Related CTA */}
          <div className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600 via-blue-600 to-violet-600 p-10 md:p-14">
            <div className="absolute inset-0 bg-slate-900/40" />
            <div className="relative max-w-2xl">
              <Badge
                color="gold"
                size="lg"
                className="mb-4 bg-white/20 border-white/30 text-white backdrop-blur"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Stay Connected
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Never miss an update
              </h2>
              <p className="text-lg text-white/90 mb-6">
                Join the PRESEC GHANA community to receive news, event
                invitations, and alumni stories directly.
              </p>
              <ButtonLink
                href="/register"
                variant="gradient"
                size="lg"
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                Join Now
              </ButtonLink>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
