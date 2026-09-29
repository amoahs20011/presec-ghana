'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Newspaper,
  Plus,
  ArrowLeft,
  Pin,
} from 'lucide-react';
import { GradientCard, GradientCardBody } from '@/components/ui/GradientCard';
import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { api } from '@/lib/api';

interface Announcement {
  id: string;
  type: string;
  title: string;
  content: string | null;
  isPinned: boolean;
  publishedAt: string;
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<{ items: Announcement[] }>(
          '/announcements?limit=100',
        );
        setNews(data.items || []);
      } catch (err) {
        console.error('Failed to load news', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/announcements/${id}`, true);
      setNews((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete announcement.');
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400">Loading...</div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-gold transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="font-display text-3xl font-extrabold text-white">
            News & Announcements
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {news.length} {news.length === 1 ? 'item' : 'items'} total
          </p>
        </div>
        <ButtonLink
          href="/admin/news/new"
          variant="gradient"
          icon={<Plus className="w-4 h-4" />}
        >
          New Announcement
        </ButtonLink>
      </div>

      {news.length === 0 ? (
        <GradientCard theme="gold" hover={false}>
          <GradientCardBody className="p-12 text-center">
            <Newspaper className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h2 className="font-display font-bold text-white text-xl mb-2">
              No news yet
            </h2>
            <p className="text-slate-400 mb-6">
              Publish your first announcement.
            </p>
            <ButtonLink href="/admin/news/new" variant="gradient">
              Create Announcement
            </ButtonLink>
          </GradientCardBody>
        </GradientCard>
      ) : (
        <div className="space-y-3">
          {news.map((item) => (
            <GradientCard key={item.id} theme="gold" hover={false}>
              <GradientCardBody className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-[250px]">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge color="sky" size="sm">
                        {item.type}
                      </Badge>
                      {item.isPinned && (
                        <Badge color="gold" size="sm">
                          <Pin className="w-3 h-3" />
                          Pinned
                        </Badge>
                      )}
                      <span className="text-xs text-slate-500">
                        {new Date(item.publishedAt).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-white text-lg mb-1">
                      {item.title}
                    </h3>
                    {item.content && (
                      <p className="text-sm text-slate-400 line-clamp-2">
                        {item.content}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <ButtonLink
                      href={`/admin/news/${item.id}/edit`}
                      variant="outline"
                      size="sm"
                    >
                      Edit
                    </ButtonLink>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(item.id, item.title)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </GradientCardBody>
            </GradientCard>
          ))}
        </div>
      )}
    </div>
  );
}
