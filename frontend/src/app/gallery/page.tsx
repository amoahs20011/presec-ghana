import Link from 'next/link';
import {
  Image as ImageIcon,
  Camera,
  ArrowRight,
  Sparkles,
  Calendar,
  Album as AlbumIcon,
  Users,
  Heart,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { GradientCard, GradientCardBody } from '@/components/ui/GradientCard';
import { api } from '@/lib/api';
import type { Paginated } from '@/types';

export const metadata = {
  title: 'Gallery',
  description: 'Photo galleries from PRESEC events, reunions, and campus.',
};

interface Album {
  id: string;
  title: string;
  description: string | null;
  coverPhotoUrl: string | null;
  photoCount: number;
}

async function getAlbums(): Promise<Album[]> {
  try {
    const data = await api.get<Paginated<Album>>(
      '/gallery/albums?limit=24',
    );
    return data.items || [];
  } catch {
    return [];
  }
}

function albumTheme(
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

export default async function GalleryPage() {
  const albums = await getAlbums();
  const totalPhotos = albums.reduce(
    (sum, a) => sum + (a.photoCount || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative container py-12">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Badge
            color="gold"
            size="lg"
            className="mb-4 bg-gold/20 border-gold/40 text-gold-light"
          >
            <Camera className="w-3.5 h-3.5" />
            Photo Gallery
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Moments in{' '}
            <span className="gradient-text-gold">Time</span>
          </h1>
          <p className="text-lg text-slate-400 mb-8">
            Relive the memories — reunions, events, campus life, and
            unforgettable moments.
          </p>
          <ButtonLink
            href="/register"
            variant="gradient"
            iconRight={<ArrowRight className="w-4 h-4" />}
          >
            Upload Photos
          </ButtonLink>
        </div>

        {/* STATS */}
        {albums.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-10 max-w-md mx-auto">
            <GradientCard theme="violet" hover={false}>
              <GradientCardBody className="p-5 text-center">
                <div className="font-display text-3xl font-extrabold text-white mb-1">
                  {albums.length}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  Albums
                </div>
              </GradientCardBody>
            </GradientCard>
            <GradientCard theme="cyan" hover={false}>
              <GradientCardBody className="p-5 text-center">
                <div className="font-display text-3xl font-extrabold text-white mb-1">
                  {totalPhotos}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  Photos
                </div>
              </GradientCardBody>
            </GradientCard>
          </div>
        )}

        {/* EMPTY */}
        {albums.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800 flex items-center justify-center">
              <AlbumIcon className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2">
              No albums yet
            </h3>
            <p className="text-slate-400 mb-6">
              Be the first to contribute photos from your PRESEC memories.
            </p>
            <ButtonLink href="/register" variant="gradient">
              Upload Photos
            </ButtonLink>
          </div>
        )}

        {/* ALBUMS GRID */}
        {albums.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album, index) => {
              const theme = albumTheme(index);
              const gradient = gradientMap(theme);

              return (
                <Link
                  key={album.id}
                  href={`/gallery/${album.id}`}
                  className="block group"
                >
                  <GradientCard theme={theme} className="h-full">
                    <GradientCardBody className="p-0 h-full flex flex-col">
                      {/* Cover */}
                      <div className="relative h-56 overflow-hidden rounded-t-2xl">
                        {album.coverPhotoUrl ? (
                          <img
                            src={album.coverPhotoUrl}
                            alt={album.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div
                            className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center opacity-80`}
                          >
                            <ImageIcon className="w-16 h-16 text-white/40" />
                          </div>
                        )}

                        {/* Photo count badge */}
                        <div className="absolute top-4 right-4">
                          <Badge
                            color="gray"
                            size="sm"
                            className="bg-slate-900/90 backdrop-blur border-slate-700 text-white"
                          >
                            <ImageIcon className="w-3 h-3" />
                            <span className="ml-1">
                              {album.photoCount || 0}
                            </span>
                          </Badge>
                        </div>

                        {/* Gradient overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-900/90 to-transparent" />
                      </div>

                      {/* Body */}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-display font-bold text-lg text-white mb-2 line-clamp-2">
                          {album.title}
                        </h3>
                        {album.description && (
                          <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1">
                            {album.description}
                          </p>
                        )}
                        <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            {album.photoCount || 0} photo
                            {album.photoCount !== 1 ? 's' : ''}
                          </span>
                          <span className="text-xs font-semibold text-gold group-hover:gap-1.5 flex items-center gap-1 transition-all">
                            View Album
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
        <div className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-pink-600 to-amber-500 p-10 md:p-14">
          <div className="absolute inset-0 bg-slate-900/40" />
          <div className="relative max-w-2xl">
            <Badge
              color="gold"
              size="lg"
              className="mb-4 bg-white/20 border-white/30 text-white backdrop-blur"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Share Your Memories
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Have PRESEC photos?
            </h2>
            <p className="text-lg text-white/90 mb-6">
              Upload your photos from reunions, events, or campus days and
              help preserve our shared memories.
            </p>
            <ButtonLink
              href="/register"
              variant="gradient"
              size="lg"
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Upload Photos
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
