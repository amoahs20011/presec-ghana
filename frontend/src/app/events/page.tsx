import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  Ticket,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { GradientCard, GradientCardBody } from '@/components/ui/GradientCard';
import { api } from '@/lib/api';
import type { EventItem, Paginated } from '@/types';

export const metadata = {
  title: 'Events',
  description:
    'Reunions, homecomings, and get-togethers for the PRESEC community.',
};

async function getEvents(): Promise<EventItem[]> {
  try {
    const data = await api.get<Paginated<EventItem>>(
      '/events?time=upcoming&limit=24',
    );
    return data.items;
  } catch {
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative container py-12">
        {/* HERO HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge
            color="gold"
            size="lg"
            className="mb-4 bg-gold/20 border-gold/40 text-gold-light"
          >
            <Calendar className="w-3.5 h-3.5" />
            Community Events
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Reunions &{' '}
            <span className="gradient-text-gold">Get-togethers</span>
          </h1>
          <p className="text-lg text-slate-400">
            Join us for reunions, homecomings, and events that bring the
            PRESEC family together.
          </p>
        </div>

        {/* EMPTY STATE */}
        {events.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800 flex items-center justify-center">
              <Calendar className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2">
              No upcoming events
            </h3>
            <p className="text-slate-400 mb-6">
              Check back soon or organize your own reunion!
            </p>
            <ButtonLink href="/register" variant="gradient">
              Join the Community
            </ButtonLink>
          </div>
        )}

        {/* EVENTS GRID */}
        {events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => {
              const themes = [
                'cyan',
                'violet',
                'gold',
                'emerald',
                'sunset',
                'ocean',
              ] as const;
              const theme = themes[index % themes.length];

              const d = new Date(event.startDatetime);
              const day = d.getDate();
              const month = d
                .toLocaleDateString('en-GB', { month: 'short' })
                .toUpperCase();
              const year = d.getFullYear();

              const gradientMap = {
                cyan: 'from-cyan-500 to-blue-500',
                violet: 'from-violet-500 to-pink-500',
                gold: 'from-amber-500 to-orange-500',
                emerald: 'from-emerald-500 to-cyan-500',
                sunset: 'from-orange-500 to-pink-500',
                ocean: 'from-blue-500 to-emerald-500',
              };

              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="block group"
                >
                  <GradientCard theme={theme} className="h-full">
                    <GradientCardBody className="p-0 h-full flex flex-col">
                      {/* COVER */}
                      <div className="relative h-44 overflow-hidden rounded-t-2xl">
                        {event.coverPhotoUrl ? (
                          <img
                            src={event.coverPhotoUrl}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div
                            className={`w-full h-full bg-gradient-to-br ${gradientMap[theme]} flex items-center justify-center opacity-80`}
                          >
                            <Calendar className="w-16 h-16 text-white/40" />
                          </div>
                        )}

                        {/* Date badge */}
                        <div className="absolute top-4 left-4 w-16 h-16 rounded-xl bg-slate-900/90 backdrop-blur-md shadow-lg flex flex-col items-center justify-center">
                          <span className="text-xl font-extrabold text-white leading-none">
                            {day}
                          </span>
                          <span className="text-2xs font-semibold text-gold tracking-wider">
                            {month}
                          </span>
                          <span className="text-2xs text-slate-500">
                            {year}
                          </span>
                        </div>

                        {/* Event type */}
                        {event.eventType && (
                          <div className="absolute top-4 right-4">
                            <Badge color={theme as any} size="sm">
                              {event.eventType.replace('_', ' ')}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* BODY */}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-display font-bold text-lg text-white mb-3 line-clamp-2">
                          {event.title}
                        </h3>

                        {event.description && (
                          <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                            {event.description}
                          </p>
                        )}

                        <div className="space-y-2 mb-4 flex-1">
                          {event.locationName && (
                            <div className="flex items-start gap-2 text-sm text-slate-300">
                              <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">
                                {event.locationName}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                            {d.toLocaleTimeString('en-GB', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>

                          {event.maxAttendees && (
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                              <Users className="w-4 h-4 text-slate-500 shrink-0" />
                              {event.registeredCount ?? 0} /{' '}
                              {event.maxAttendees} attending
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {event.ticketPrice &&
                            Number(event.ticketPrice) > 0 ? (
                              <Badge color="gold" size="sm">
                                <Ticket className="w-3 h-3" />
                                {event.currency}{' '}
                                {Number(event.ticketPrice).toFixed(0)}
                              </Badge>
                            ) : (
                              <Badge color="green" size="sm">
                                Free
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-gold group-hover:gap-1.5 flex items-center gap-1 transition-all">
                            View
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </GradientCardBody>
                  </GradientCard>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA BANNER */}
        <div className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-pink-600 to-amber-500 p-10 md:p-14">
          <div className="absolute inset-0 bg-slate-900/40" />
          <div className="relative max-w-2xl">
            <Badge
              color="gold"
              size="lg"
              className="mb-4 bg-white/20 border-white/30 text-white backdrop-blur"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Host Your Own
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Organize a reunion
            </h2>
            <p className="text-lg text-white/90 mb-6">
              Bring your year group back together. We&apos;ll help you plan,
              promote, and manage the event.
            </p>
            <ButtonLink
              href="/register"
              variant="gradient"
              size="lg"
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Get Started
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
