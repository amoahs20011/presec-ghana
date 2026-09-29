import Link from 'next/link';
import {
  ArrowLeft,
  Image as ImageIcon,
  Camera,
  Calendar,
  ArrowRight,
  Sparkles,
  Download,
  Share2,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { GradientCard, GradientCardBody, GradientIcon } from '@/components/ui/GradientCard';
import { api } from '@/lib/api';
import { notFound } from 'next/navigation';

interface Photo {
  id: string;
  url: string;
  caption: string | null;
}

interface Album {
  id: string;
  title: string;
  description: string | null;
  coverPhotoUrl: string | null;
  photos: Photo[];
  createdAt?: string;
}

async function getAlbum(id: string): Promise<Album | null> {
  try {
    return await api.get<Album>(`/gallery/albums/${id}`);
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
  const album = await getAlbum(id);
  return { title: album?.title || 'Album Not Found' };
}

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const album = await getAlbum(id);

  if (!album) notFound();

  const photos = album.photos || [];

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#172554] via-[#1E3A8A] to-[#0F172A] py-16">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />

          <div className="container relative">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-gold transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Gallery
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge
                color="gold"
                size="lg"
                className="bg-gold/20 border-gold/40 text-gold-light"
              >
                <Camera className="w-3.5 h-3.5" />
                Photo Album
              </Badge>
              <Badge
                color="gray"
                size="lg"
                className="bg-slate-800/80 border-slate-700 text-slate-300"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span className="ml-1.5">
                  {photos.length} photo{photos.length !== 1 ? 's' : ''}
                </span>
              </Badge>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 max-w-4xl">
              {album.title}
            </h1>

            {album.description && (
              <p className="text-lg text-slate-300 max-w-3xl">
                {album.description}
              </p>
            )}
          </div>
        </section>

        {/* PHOTOS */}
        <section className="container py-12">
          {photos.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                No photos in this album yet
              </h3>
              <p className="text-slate-400 mb-6">
                Check back soon for photos from this event.
              </p>
              <ButtonLink href="/gallery" variant="gradient">
                Back to Gallery
              </ButtonLink>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-slate-700 hover:border-gold transition-all duration-300 hover:-translate-y-1"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Photo'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    {photo.caption && (
                      <p className="text-xs text-white line-clamp-2">
                        {photo.caption}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-gold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All albums
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-gold transition-colors text-sm"
            >
              <Share2 className="w-4 h-4" />
              Share Album
            </button>
          </div>

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
                Add to This Album
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Have photos from this event?
              </h2>
              <p className="text-lg text-white/90 mb-6">
                Help us complete this album. Upload your photos and share
                your perspective with the community.
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
        </section>
      </div>
    </div>
  );
}
