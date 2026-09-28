import { Section } from '@/components/ui/Section';
import { Card, CardBody } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Album {
  id: string;
  title: string;
  description: string | null;
  coverPhotoUrl: string | null;
  photos: Photo[];
}

interface Photo {
  id: string;
  url: string;
  caption: string | null;
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

  return (
    <>
      <section className="bg-presec-blue text-white py-12 lg:py-16">
        <div className="container">
          <Link
            href="/gallery"
            className="text-sm text-presec-gold hover:underline"
          >
            ← Back to Gallery
          </Link>
          <h1 className="mt-6 text-3xl lg:text-4xl font-bold">
            {album.title}
          </h1>
          {album.description && (
            <p className="mt-3 text-gray-200 max-w-2xl">
              {album.description}
            </p>
          )}
          <p className="mt-3 text-sm text-presec-gold">
            {album.photos?.length || 0}{' '}
            {album.photos?.length === 1 ? 'photo' : 'photos'}
          </p>
        </div>
      </section>

      <Section>
        {!album.photos || album.photos.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-presec-text-muted">
                No photos in this album yet.
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {album.photos.map((photo) => (
              <div
                key={photo.id}
                className="bg-white border border-presec-border rounded-lg overflow-hidden shadow-sm"
              >
                <div className="aspect-video bg-presec-bg-alt flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Photo'}
                    className="w-full h-full object-cover"
                  />
                </div>
                {photo.caption && (
                  <div className="p-3">
                    <p className="text-sm text-presec-text">
                      {photo.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
