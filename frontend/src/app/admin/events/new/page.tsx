'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Save } from 'lucide-react';
import { GradientCard, GradientCardBody } from '@/components/ui/GradientCard';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { api } from '@/lib/api';

export default function NewEventPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    eventType: 'reunion',
    startDatetime: '',
    endDatetime: '',
    locationName: '',
    locationAddress: '',
    maxAttendees: '',
    ticketPrice: '',
  });

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) return setError('Title is required');
    if (!form.startDatetime) return setError('Start date is required');

    setSaving(true);
    try {
      await api.post(
        '/events',
        {
          title: form.title,
          description: form.description || null,
          eventType: form.eventType,
          startDatetime: form.startDatetime,
          endDatetime: form.endDatetime || null,
          locationName: form.locationName || null,
          locationAddress: form.locationAddress || null,
          maxAttendees: form.maxAttendees
            ? parseInt(form.maxAttendees, 10)
            : null,
          ticketPrice: form.ticketPrice
            ? parseFloat(form.ticketPrice)
            : 0,
          currency: 'GHS',
        },
        true,
      );
      router.push('/admin/events');
    } catch (err: any) {
      setError(err?.message || 'Failed to create event');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-gold transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>
        <h1 className="font-display text-3xl font-extrabold text-white">
          Create New Event
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
            <Input
              label="Event Title"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g. PRESEC 2008 Reunion"
              required
              fullWidth
            />

            <Textarea
              label="Description"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Describe the event..."
              rows={4}
              fullWidth
            />

            <Select
              label="Event Type"
              value={form.eventType}
              onChange={(e) => update('eventType', e.target.value)}
              fullWidth
            >
              <option value="reunion">Reunion</option>
              <option value="homecoming">Homecoming</option>
              <option value="get_together">Get-together</option>
              <option value="school_programme">School Programme</option>
            </Select>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date & Time"
                type="datetime-local"
                value={form.startDatetime}
                onChange={(e) => update('startDatetime', e.target.value)}
                required
                fullWidth
              />
              <Input
                label="End Date & Time"
                type="datetime-local"
                value={form.endDatetime}
                onChange={(e) => update('endDatetime', e.target.value)}
                fullWidth
              />
            </div>

            <Input
              label="Location Name"
              value={form.locationName}
              onChange={(e) => update('locationName', e.target.value)}
              placeholder="e.g. Accra International Conference Centre"
              fullWidth
            />

            <Input
              label="Location Address"
              value={form.locationAddress}
              onChange={(e) => update('locationAddress', e.target.value)}
              placeholder="Full address"
              fullWidth
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Max Attendees"
                type="number"
                value={form.maxAttendees}
                onChange={(e) => update('maxAttendees', e.target.value)}
                placeholder="e.g. 200"
                fullWidth
              />
              <Input
                label="Ticket Price (GHS)"
                type="number"
                step="0.01"
                value={form.ticketPrice}
                onChange={(e) => update('ticketPrice', e.target.value)}
                placeholder="0 for free"
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
                Create Event
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push('/admin/events')}
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
