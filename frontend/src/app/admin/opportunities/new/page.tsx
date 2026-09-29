'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { GradientCard, GradientCardBody } from '@/components/ui/GradientCard';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { api } from '@/lib/api';

export default function NewOpportunityPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    type: 'job',
    title: '',
    description: '',
    companyName: '',
    location: '',
    industry: '',
    jobType: 'full_time',
    salaryRange: '',
    deadline: '',
  });

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) return setError('Title is required');

    setSaving(true);
    try {
      await api.post(
        '/opportunities',
        {
          type: form.type,
          title: form.title,
          description: form.description || null,
          companyName: form.companyName || null,
          location: form.location || null,
          industry: form.industry || null,
          jobType: form.jobType || null,
          salaryRange: form.salaryRange || null,
          deadline: form.deadline || null,
        },
        true,
      );
      router.push('/admin/opportunities');
    } catch (err: any) {
      setError(err?.message || 'Failed to create opportunity');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/opportunities"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-gold transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Opportunities
        </Link>
        <h1 className="font-display text-3xl font-extrabold text-white">
          New Opportunity
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      <GradientCard theme="cyan" hover={false}>
        <GradientCardBody className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Select
              label="Type"
              value={form.type}
              onChange={(e) => update('type', e.target.value)}
              fullWidth
            >
              <option value="job">Job</option>
              <option value="internship">Internship</option>
              <option value="scholarship">Scholarship</option>
              <option value="training">Training</option>
              <option value="national_service">National Service</option>
            </Select>

            <Input
              label="Title"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              required
              fullWidth
            />

            <Textarea
              label="Description"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Describe the role, requirements, and benefits..."
              rows={5}
              fullWidth
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company / Organization"
                value={form.companyName}
                onChange={(e) => update('companyName', e.target.value)}
                placeholder="e.g. TechCorp Ghana"
                fullWidth
              />
              <Input
                label="Location"
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                placeholder="e.g. Accra, Ghana"
                fullWidth
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Industry"
                value={form.industry}
                onChange={(e) => update('industry', e.target.value)}
                placeholder="e.g. Information Technology"
                fullWidth
              />
              <Input
                label="Job Type"
                value={form.jobType}
                onChange={(e) => update('jobType', e.target.value)}
                placeholder="e.g. full_time"
                fullWidth
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Salary / Compensation"
                value={form.salaryRange}
                onChange={(e) => update('salaryRange', e.target.value)}
                placeholder="e.g. GHS 15,000 monthly"
                fullWidth
              />
              <Input
                label="Deadline"
                type="date"
                value={form.deadline}
                onChange={(e) => update('deadline', e.target.value)}
                fullWidth
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <Button
                type="submit"
                variant="gradient"
                loading={saving}
                icon={<Save className="w-4 h-4" />}
              >
                Create Opportunity
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push('/admin/opportunities')}
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
