import { Section } from '@/components/ui/Section';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import type { Paginated } from '@/types';
import Link from 'next/link';

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
    return data.items;
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const albums = await getAlbums();

  return (
    <>
      <section className="bg-presec-blue text-white py-12 lg:py-16">
        <div className="container">
          <Badge color="gold">Photo Gallery</Badge>
          <h1 className="mt-4 text-4xl lg:text-5xl font-bold">Gallery</h1>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl">
            Moments from reunions, campus life, and PRESEC community
            events.
          </p>
        </div>
      </section>

      <Section>
        {albums.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-presec-text-muted">
                No albums yet. Check back soon!
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <Card key={album.id} hover>
                <Link href={`/gallery/${album.id}`}>
                  <div className="aspect-video bg-presec-bg-alt flex items-center justify-center overflow-hidden rounded-t-lg">
                    {album.coverPhotoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={album.coverPhotoUrl}
                        alt={album.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl">📸</span>
                    )}
                  </div>
                  <CardBody>
                    <h3 className="font-semibold text-presec-blue line-clamp-2">
                      {album.title}
                    </h3>
                    {album.description && (
                      <p className="mt-2 text-sm text-presec-text-muted line-clamp-2">
                        {album.description}
                      </p>
                    )}
                    <p className="mt-3 text-xs text-presec-text-muted">
                      {album.photoCount}{' '}
                      {album.photoCount === 1 ? 'photo' : 'photos'}
                    </p>
                  </CardBody>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
