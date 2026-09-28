import { Section } from '@/components/ui/Section';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import type { Announcement, Paginated } from '@/types';
import Link from 'next/link';

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

function typeColor(type: string) {
  switch (type) {
    case 'achievement':
      return 'gold' as const;
    case 'news':
      return 'blue' as const;
    case 'memorial':
    case 'condolence':
      return 'gray-dark' as const;
    case 'birth':
    case 'wedding':
      return 'green' as const;
    default:
      return 'gray' as const;
  }
}

export default async function NewsPage() {
  const news = await getNews();

  return (
    <>
      <section className="bg-presec-blue text-white py-12 lg:py-16">
        <div className="container">
          <Badge color="gold">Community News</Badge>
          <h1 className="mt-4 text-4xl lg:text-5xl font-bold">
            News &amp; Announcements
          </h1>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl">
            Stay updated with the latest from PRESEC schools, alumni, and
            community.
          </p>
        </div>
      </section>

      <Section>
        {news.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-presec-text-muted">
                No news yet. Check back soon!
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <Card key={item.id} hover>
                <Link href={`/news/${item.id}`}>
                  <CardBody>
                    <div className="flex items-start justify-between gap-2">
                      <Badge color={typeColor(item.type)}>
                        {item.type}
                      </Badge>
                      {item.isPinned && (
                        <Badge color="red">📌 Pinned</Badge>
                      )}
                    </div>
                    <h3 className="mt-3 font-semibold text-lg text-presec-blue line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-presec-text-muted line-clamp-3">
                      {item.content}
                    </p>
                    <div className="mt-4 text-xs text-presec-text-muted">
                      {new Date(item.publishedAt).toLocaleDateString(
                        'en-GB',
                        {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        },
                      )}
                    </div>
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
