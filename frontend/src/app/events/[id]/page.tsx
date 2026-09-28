import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  ArrowLeft,
  Share2,
  Award,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { GradientCard, GradientCardBody, GradientIcon } from '@/components/ui/GradientCard';
import { api } from '@/lib/api';
import type { EventItem } from '@/types';
import { notFound } from 'next/navigation';

async function getEvent(id: string): Promise<EventItem | null> {
  try {
    return await api.get<EventItem>(`/events/${id}`);
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
  const event = await getEvent(id);
  return { title: event?.title || 'Event Not Found' };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) notFound();

  const start = new Date(event.startDatetime);
  const end = event.endDatetime ? new Date(event.endDatetime) : null;

  const isFree = !event.ticketPrice || Number(event.ticketPrice) === 0;
  const spotsLeft = event.maxAttendees
    ? event.maxAttendees - (event.registeredCount ?? 0)
    : null;

  const day = start.getDate();
  const month = start
    .toLocaleDateString('en-GB', { month: 'long' })
    .toUpperCase();
  const year = start.getFullYear();

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#172554] via-[#1E3A8A] to-[#0F172A] py-16">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />

          <div className="container relative">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-gold transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>

            <div className="grid lg:grid-cols-[auto_1fr] gap-6 items-start mb-6">
              {/* DATE BLOCK */}
              <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex flex-col items-center justify-center">
                <div className="text-4xl font-extrabold text-white leading-none">
                  {day}
                </div>
                <div className="text-xs font-semibold text-gold tracking-widest mt-1">
                  {month}
                </div>
                <div className="text-2xs text-slate-400">{year}</div>
              </div>

              {/* TITLE + META */}
              <div>
                <Badge
                  color="gold"
                  size="lg"
                  className="mb-3 bg-gold/20 border-gold/40 text-gold-light"
                >
                  <Award className="w-3.5 h-3.5" />
                  {event.eventType.replace('_', ' ')}
                </Badge>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
                  {event.title}
                </h1>

                <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4 text-gold" />
                    {start.toLocaleDateString('en-GB', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-4 h-4 text-gold" />
                    {start.toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {end &&
                      ` – ${end.toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}`}
                  </div>

                  {event.locationName && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4 text-gold" />
                      {event.locationName}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* COVER IMAGE */}
            {event.coverPhotoUrl && (
              <div className="mt-8 rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={event.coverPhotoUrl}
                  alt={event.title}
                  className="w-full h-64 lg:h-96 object-cover"
                />
              </div>
            )}
          </div>
        </section>

        {/* CONTENT */}
        <section className="container py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT: About */}
            <div className="lg:col-span-2 space-y-6">
              <GradientCard theme="cyan" hover={false}>
                <GradientCardBody className="p-6">
                  <h2 className="font-display text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <GradientIcon theme="cyan" size="sm">
                      <Calendar className="w-5 h-5" />
                    </GradientIcon>
                    About this Event
                  </h2>
                  <p className="text-slate-300 whitespace-pre-line leading-relaxed">
                    {event.description ||
                      'No description provided for this event.'}
                  </p>
                </GradientCardBody>
              </GradientCard>

              {event.locationName && (
                <GradientCard theme="violet" hover={false}>
                  <GradientCardBody className="p-6">
                    <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <GradientIcon theme="violet" size="sm">
                        <MapPin className="w-5 h-5" />
                      </GradientIcon>
                      Location
                    </h2>
                    <div className="text-slate-300">
                      <div className="font-semibold text-white mb-1">
                        {event.locationName}
                      </div>
                      {event.locationAddress && (
                        <div className="text-sm text-slate-400">
                          {event.locationAddress}
                        </div>
                      )}
                    </div>
                  </GradientCardBody>
                </GradientCard>
              )}
            </div>

            {/* RIGHT: Sticky registration card */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <GradientCard theme="gold" hover={false}>
                  <GradientCardBody className="p-6">
                    <h3 className="font-display text-xl font-bold text-white mb-5">
                      Event Details
                    </h3>

                    <div className="space-y-4 mb-6">
                      {/* Price */}
                      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Ticket className="w-4 h-4" />
                          Price
                        </div>
                        <div className="font-bold text-white">
                          {isFree
                            ? 'Free'
                            : `${event.currency} ${Number(event.ticketPrice).toFixed(0)}`}
                        </div>
                      </div>

                      {/* Capacity */}
                      {event.maxAttendees && (
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Users className="w-4 h-4" />
                            Capacity
                          </div>
                          <div className="font-bold text-white">
                            {event.registeredCount ?? 0} / {event.maxAttendees}
                          </div>
                        </div>
                      )}

                      {/* Spots left */}
                      {spotsLeft !== null && (
                        <div className="text-center">
                          {spotsLeft > 0 ? (
                            <Badge color="green">
                              {spotsLeft} spots left
                            </Badge>
                          ) : (
                            <Badge color="red">Fully booked</Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Register button */}
                    <ButtonLink
                      href={`/events/${event.id}/register`}
                      variant="gradient"
                      size="lg"
                      fullWidth
                    >
                      Register for this Event
                    </ButtonLink>

                    <p className="text-xs text-slate-500 text-center mt-3">
                      Login required
                    </p>

                    {/* Share */}
                    <button
                      type="button"
                      className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white transition-colors py-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Share this event
                    </button>
                  </GradientCardBody>
                </GradientCard>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}





