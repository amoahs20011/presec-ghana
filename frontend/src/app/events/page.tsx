import { Section } from '@/components/ui/Section';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import type { EventItem, Paginated } from '@/types';
import Link from 'next/link';

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
    <>
      <section className="bg-presec-blue text-white py-12 lg:py-16">
        <div className="container">
          <Badge color="gold">Community Events</Badge>
          <h1 className="mt-4 text-4xl lg:text-5xl font-bold">
            Upcoming Events
          </h1>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl">
            Reunions, homecomings, get-togethers, and school programmes.
          </p>
        </div>
      </section>

      <Section>
        {events.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-presec-text-muted">
                No upcoming events at the moment. Check back soon!
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const start = new Date(event.startDatetime);
              return (
                <Card key={event.id} hover>
                  <Link href={`/events/${event.id}`}>
                    <CardBody>
                      <div className="flex items-start justify-between gap-3">
                        <div className="bg-presec-blue text-white rounded-lg p-3 text-center flex-shrink-0">
                          <div className="text-2xl font-bold">
                            {start.getDate()}
                          </div>
                          <div className="text-xs uppercase">
                            {start.toLocaleString('en-GB', {
                              month: 'short',
                            })}
                          </div>
                          <div className="text-xs">
                            {start.getFullYear()}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <Badge color="blue">
                            {event.eventType.replace('_', ' ')}
                          </Badge>
                          <h3 className="mt-2 font-semibold text-presec-blue line-clamp-2">
                            {event.title}
                          </h3>
                        </div>
                      </div>

                      {event.description && (
                        <p className="mt-3 text-sm text-presec-text-muted line-clamp-2">
                          {event.description}
                        </p>
                      )}

                      <div className="mt-4 space-y-1 text-sm text-presec-text-muted">
                        {event.locationName && (
                          <p>📍 {event.locationName}</p>
                        )}
                        <p>
                          🕐{' '}
                          {start.toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-presec-border flex justify-between items-center">
                        <span className="text-sm font-semibold text-presec-blue">
                          {Number(event.ticketPrice) === 0
                            ? 'Free'
                            : `${event.currency} ${Number(event.ticketPrice).toLocaleString()}`}
                        </span>
                        <span className="text-xs text-presec-text-muted">
                          {event.registeredCount ?? 0} registered
                        </span>
                      </div>
                    </CardBody>
                  </Link>
                </Card>
              );
            })}
          </div>
        )}
      </Section>
    </>
  );
}
