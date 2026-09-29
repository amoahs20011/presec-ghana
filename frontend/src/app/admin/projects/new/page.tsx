'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { GradientCard, GradientCardBody } from '@/components/ui/GradientCard';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { api } from '@/lib/api';

export default function NewProjectPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'infrastructure',
    targetAmount: '',
    status: 'active',
  });

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) return setError('Title is required');
    if (!form.targetAmount) return setError('Target amount is required');
    const target = parseFloat(form.targetAmount);
    if (isNaN(target) || target <= 0)
      return setError('Target amount must be a positive number');

    setSaving(true);
    try {
      await api.post(
        '/projects',
        {
          title: form.title,
          description: form.description || null,
          category: form.category,
          targetAmount: target,
          raisedAmount: 0,
          currency: 'GHS',
          status: form.status,
        },
        true,
      );
      router.push('/admin/projects');
    } catch (err: any) {
      setError(err?.message || 'Failed to create project');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-gold transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <h1 className="font-display text-3xl font-extrabold text-white">
          Create New Project
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      <GradientCard theme="emerald" hover={false}>
        <GradientCardBody className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Project Title"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g. Computer Laboratory Renovation"
              required
              fullWidth
            />

            <Textarea
              label="Description"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Describe the project, its goals, and impact..."
              rows={5}
              fullWidth
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Category"
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                fullWidth
              >
                <option value="infrastructure">Infrastructure</option>
                <option value="academic">Academic</option>
                <option value="sports">Sports</option>
                <option value="equipment">Equipment</option>
                <option value="scholarship">Scholarship</option>
                <option value="other">Other</option>
              </Select>

              <Select
                label="Status"
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
                fullWidth
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </Select>
            </div>

            <Input
              label="Target Amount (GHS)"
              type="number"
              step="0.01"
              value={form.targetAmount}
              onChange={(e) => update('targetAmount', e.target.value)}
              placeholder="e.g. 200000"
              required
              fullWidth
            />

            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <Button
                type="submit"
                variant="gradient"
                loading={saving}
                icon={<Save className="w-4 h-4" />}
              >
                Create Project
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push('/admin/projects')}
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
