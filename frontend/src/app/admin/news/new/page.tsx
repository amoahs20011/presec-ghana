'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { GradientCard, GradientCardBody } from '@/components/ui/GradientCard';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { api } from '@/lib/api';

export default function NewAnnouncementPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    type: 'news',
    title: '',
    content: '',
    isPinned: false,
  });

  function update(key: keyof typeof form, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) return setError('Title is required');
    if (!form.content.trim()) return setError('Content is required');

    setSaving(true);
    try {
      await api.post(
        '/announcements',
        {
          type: form.type,
          title: form.title,
          content: form.content,
          isPinned: form.isPinned,
        },
        true,
      );
      router.push('/admin/news');
    } catch (err: any) {
      setError(err?.message || 'Failed to create announcement');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/news"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-gold transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to News
        </Link>
        <h1 className="font-display text-3xl font-extrabold text-white">
          New Announcement
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      <GradientCard theme="gold" hover={false}>
        <GradientCardBody className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Select
              label="Type"
              value={form.type}
              onChange={(e) => update('type', e.target.value)}
              fullWidth
            >
              <option value="news">News</option>
              <option value="achievement">Achievement</option>
              <option value="announcement">Announcement</option>
              <option value="birth">Birth</option>
              <option value="wedding">Wedding</option>
              <option value="memorial">Memorial</option>
              <option value="condolence">Condolence</option>
            </Select>

            <Input
              label="Title"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Announcement title"
              required
              fullWidth
            />

            <Textarea
              label="Content"
              value={form.content}
              onChange={(e) => update('content', e.target.value)}
              placeholder="Full announcement content..."
              rows={6}
              required
              fullWidth
            />

            <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <input
                type="checkbox"
                checked={form.isPinned}
                onChange={(e) => update('isPinned', e.target.checked)}
                className="w-4 h-4"
              />
              <div>
                <div className="font-semibold text-white text-sm">
                  Pin this announcement
                </div>
                <div className="text-xs text-slate-400">
                  Pinned announcements appear at the top
                </div>
              </div>
            </label>

            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <Button
                type="submit"
                variant="gradient"
                loading={saving}
                icon={<Save className="w-4 h-4" />}
              >
                Publish
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push('/admin/news')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </GradientCardBody>
      </GradientCard>
    </div>
  );
}
