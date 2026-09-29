'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Plus,
  ArrowLeft,
  MapPin,
  Users,
  Ticket,
  Loader2,
} from 'lucide-react';
import { GradientCard, GradientCardBody, GradientIcon } from '@/components/ui/GradientCard';
import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { api } from '@/lib/api';

interface EventItem {
  id: string;
  title: string;
  eventType: string;
  startDatetime: string;
  locationName: string | null;
  ticketPrice: string;
  currency: string;
  maxAttendees: number | null;
  registeredCount?: number;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<{ items: EventItem[] }>(
          '/events?limit=100',
        );
        setEvents(data.items || []);
      } catch (err) {
        console.error('Failed to load events', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/events/${id}`, true);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete event.');
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
            Events
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {events.length} {events.length === 1 ? 'event' : 'events'} total
          </p>
        </div>
        <ButtonLink
          href="/admin/events/new"
          variant="gradient"
          icon={<Plus className="w-4 h-4" />}
        >
          New Event
        </ButtonLink>
      </div>

      {events.length === 0 ? (
        <GradientCard theme="cyan" hover={false}>
          <GradientCardBody className="p-12 text-center">
            <Calendar className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h2 className="font-display font-bold text-white text-xl mb-2">
              No events yet
            </h2>
            <p className="text-slate-400 mb-6">
              Create your first event to get started.
            </p>
            <ButtonLink href="/admin/events/new" variant="gradient">
              Create Event
            </ButtonLink>
          </GradientCardBody>
        </GradientCard>
      ) : (
        <div className="space-y-3">
          {events.map((event) => {
            const date = new Date(event.startDatetime);
            const isFree =
              !event.ticketPrice || Number(event.ticketPrice) === 0;

            return (
              <GradientCard key={event.id} theme="cyan" hover={false}>
                <GradientCardBody className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-[250px]">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge color="gold" size="sm">
                          {event.eventType.replace('_', ' ')}
                        </Badge>
                        {isFree ? (
                          <Badge color="green" size="sm">
                            Free
                          </Badge>
                        ) : (
                          <Badge color="sky" size="sm">
                            {event.currency} {Number(event.ticketPrice).toFixed(0)}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-display font-bold text-white text-lg mb-2">
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {date.toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        {event.locationName && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {event.locationName}
                          </span>
                        )}
                        {event.maxAttendees && (
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            {event.registeredCount ?? 0} / {event.maxAttendees}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <ButtonLink
                        href={`/admin/events/${event.id}/edit`}
                        variant="outline"
                        size="sm"
                      >
                        Edit
                      </ButtonLink>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(event.id, event.title)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </GradientCardBody>
              </GradientCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
