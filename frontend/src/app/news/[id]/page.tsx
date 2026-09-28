import { Section } from '@/components/ui/Section';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import type { Announcement } from '@/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';

async function getAnnouncement(id: string): Promise<Announcement | null> {
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
  const item = await getAnnouncement(id);
  return { title: item?.title || 'News Not Found' };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getAnnouncement(id);

  if (!item) notFound();

  return (
    <>
      <section className="bg-presec-blue text-white py-12 lg:py-16">
        <div className="container">
          <Link
            href="/news"
            className="text-sm text-presec-gold hover:underline"
          >
            ← Back to News
          </Link>
          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              <Badge color="gold">{item.type}</Badge>
              {item.isPinned && <Badge color="red">📌 Pinned</Badge>}
            </div>
            <h1 className="mt-3 text-3xl lg:text-4xl font-bold max-w-4xl">
              {item.title}
            </h1>
            <p className="mt-3 text-sm text-gray-200">
              {new Date(item.publishedAt).toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </section>

      <Section>
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardBody>
              <p className="text-presec-text whitespace-pre-line text-lg leading-relaxed">
                {item.content}
              </p>
            </CardBody>
          </Card>
        </div>
      </Section>
    </>
  );
}
