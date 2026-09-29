import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  Award,
  Image as ImageIcon,
  FileText,
  Film,
  Music,
  Trophy,
  ArrowRight,
  Sparkles,
  Camera,
  ScrollText,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { GradientCard, GradientCardBody } from '@/components/ui/GradientCard';
import { api } from '@/lib/api';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Heritage',
  description:
    'The PRESEC digital museum — photos, documents, and memories from our history.',
};

interface HeritageItem {
  id: string;
  type: string;
  title: string;
  description: string | null;
  fileUrl: string | null;
  thumbnailUrl: string | null;
  yearEstimate: number | null;
  source: string | null;
}

interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string | null;
  year: number | null;
  photoUrl: string | null;
}

async function getHeritage(): Promise<{
  items: HeritageItem[];
  achievements: Achievement[];
}> {
  try {
    const [items, achievements] = await Promise.all([
      api.get<HeritageItem[]>('/heritage'),
      api.get<Achievement[]>('/heritage/achievements'),
    ]);
    return {
      items: Array.isArray(items) ? items : [],
      achievements: Array.isArray(achievements) ? achievements : [],
    };
  } catch {
    return { items: [], achievements: [] };
  }
}

function typeTheme(
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

function itemTypeIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'photo':
    case 'image':
      return <ImageIcon className="w-3.5 h-3.5" />;
    case 'document':
      return <FileText className="w-3.5 h-3.5" />;
    case 'video':
      return <Film className="w-3.5 h-3.5" />;
    case 'audio':
      return <Music className="w-3.5 h-3.5" />;
    default:
      return <ScrollText className="w-3.5 h-3.5" />;
  }
}

function achievementIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'academic':
      return <BookOpen className="w-3.5 h-3.5" />;
    case 'sports':
      return <Trophy className="w-3.5 h-3.5" />;
    case 'alumni':
      return <Award className="w-3.5 h-3.5" />;
    default:
      return <Award className="w-3.5 h-3.5" />;
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

export default async function HeritagePage() {
  const { items, achievements } = await getHeritage();

  const decades = items.reduce(
    (acc, item) => {
      if (item.yearEstimate) {
        const decade = Math.floor(item.yearEstimate / 10) * 10;
        if (!acc[decade]) acc[decade] = [];
        acc[decade].push(item);
      }
      return acc;
    },
    {} as Record<number, HeritageItem[]>,
  );

  const sortedDecades = Object.keys(decades)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative container py-12">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge
            color="gold"
            size="lg"
            className="mb-4 bg-gold/20 border-gold/40 text-gold-light"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Digital Museum
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Our{' '}
            <span className="gradient-text-gold">Living History</span>
          </h1>
          <p className="text-lg text-slate-400">
            Explore decades of PRESEC memories — photos, documents,
            achievements, and stories from our shared journey.
          </p>
        </div>

        {/* ACHIEVEMENTS */}
        {achievements.length > 0 && (
          <div className="mb-16">
            <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
              <div>
                <Badge color="gold" className="mb-3">
                  <Trophy className="w-3.5 h-3.5" />
                  Achievements
                </Badge>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                  Proud <span className="gradient-text-gold">Moments</span>
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.slice(0, 6).map((ach, index) => {
                const theme = typeTheme(index);
                const gradient = gradientMap(theme);

                return (
                  <GradientCard key={ach.id} theme={theme} className="h-full">
                    <GradientCardBody className="p-6 h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shrink-0`}
                        >
                          {achievementIcon(ach.type)}
                        </div>
                        <Badge color={theme as any} size="sm">
                          {ach.type}
                        </Badge>
                      </div>
                      <h3 className="font-display font-bold text-lg text-white mb-2 line-clamp-2">
                        {ach.title}
                      </h3>
                      {ach.description && (
                        <p className="text-sm text-slate-400 line-clamp-3 mb-4 flex-1">
                          {ach.description}
                        </p>
                      )}
                      {ach.year && (
                        <div className="mt-auto flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {ach.year}
                        </div>
                      )}
                    </GradientCardBody>
                  </GradientCard>
                );
              })}
            </div>
          </div>
        )}

        {/* EMPTY */}
        {items.length === 0 && achievements.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800 flex items-center justify-center">
              <Camera className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2">
              Heritage archive coming soon
            </h3>
            <p className="text-slate-400 mb-6">
              We&apos;re collecting photos and documents from our shared
              history. Check back soon!
            </p>
            <ButtonLink href="/" variant="gradient">
              Back to Home
            </ButtonLink>
          </div>
        )}

        {/* TIMELINE */}
        {items.length > 0 && (
          <div>
            <div className="text-center mb-10">
              <Badge color="violet" className="mb-3">
                <Calendar className="w-3.5 h-3.5" />
                Timeline
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                Through the <span className="gradient-text-gold">Decades</span>
              </h2>
            </div>

            {sortedDecades.length > 0 ? (
              <div className="space-y-12">
                {sortedDecades.map((decade) => (
                  <div key={decade}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-3xl font-extrabold gradient-text-gold">
                        {decade}s
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-gold/50 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {decades[decade].map((item, index) => {
                        const theme = typeTheme(index);
                        const gradient = gradientMap(theme);

                        return (
                          <GradientCard
                            key={item.id}
                            theme={theme}
                            className="h-full"
                          >
                            <GradientCardBody className="p-0 h-full flex flex-col">
                              {/* Thumbnail */}
                              <div className="relative h-40 overflow-hidden rounded-t-2xl">
                                {item.thumbnailUrl || item.fileUrl ? (
                                  <img
                                    src={
                                      item.thumbnailUrl || item.fileUrl || ''
                                    }
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div
                                    className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center opacity-80`}
                                  >
                                    <Camera className="w-12 h-12 text-white/40" />
                                  </div>
                                )}

                                <div className="absolute top-4 left-4">
                                  <Badge
                                    color={theme as any}
                                    size="sm"
                                    className="bg-slate-900/90 backdrop-blur"
                                  >
                                    {itemTypeIcon(item.type)}
                                    <span className="ml-1">{item.type}</span>
                                  </Badge>
                                </div>
                              </div>

                              <div className="p-5 flex flex-col flex-1">
                                <h3 className="font-display font-bold text-white mb-2 line-clamp-2">
                                  {item.title}
                                </h3>
                                {item.description && (
                                  <p className="text-sm text-slate-400 line-clamp-2 mb-3 flex-1">
                                    {item.description}
                                  </p>
                                )}
                                <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-800">
                                  {item.yearEstimate && (
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {item.yearEstimate}
                                    </span>
                                  )}
                                  {item.source && (
                                    <span className="text-xs text-slate-500 line-clamp-1">
                                      {item.source}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </GradientCardBody>
                          </GradientCard>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, index) => {
                  const theme = typeTheme(index);
                  const gradient = gradientMap(theme);

                  return (
                    <GradientCard
                      key={item.id}
                      theme={theme}
                      className="h-full"
                    >
                      <GradientCardBody className="p-0 h-full flex flex-col">
                        <div className="relative h-40 overflow-hidden rounded-t-2xl">
                          {item.thumbnailUrl || item.fileUrl ? (
                            <img
                              src={item.thumbnailUrl || item.fileUrl || ''}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center opacity-80`}
                            >
                              <Camera className="w-12 h-12 text-white/40" />
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <Badge
                              color={theme as any}
                              size="sm"
                              className="bg-slate-900/90 backdrop-blur"
                            >
                              {itemTypeIcon(item.type)}
                              <span className="ml-1">{item.type}</span>
                            </Badge>
                          </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-display font-bold text-white mb-2 line-clamp-2">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-slate-400 line-clamp-2 mb-3 flex-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </GradientCardBody>
                    </GradientCard>
                  );
                })}
              </div>
            )}
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
              Contribute to History
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Have old photos or documents?
            </h2>
            <p className="text-lg text-white/90 mb-6">
              Help us preserve our shared history. Share your PRESEC memories
              — photos, yearbooks, documents — and become part of our
              digital museum.
            </p>
            <ButtonLink
              href="/register"
              variant="gradient"
              size="lg"
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Contribute to Heritage
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
