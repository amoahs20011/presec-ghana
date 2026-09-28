import { Section } from '@/components/ui/Section';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import type { EventItem } from '@/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';

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

  return (
    <>
      <section className="bg-presec-blue text-white py-12 lg:py-16">
        <div className="container">
          <Link
            href="/events"
            className="text-sm text-presec-gold hover:underline"
          >
            ← Back to Events
          </Link>
          <div className="mt-6">
            <Badge color="gold">
              {event.eventType.replace('_', ' ')}
            </Badge>
            <h1 className="mt-3 text-3xl lg:text-4xl font-bold">
              {event.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-200">
              <span>
                📅{' '}
                {start.toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <span>
                🕐{' '}
                {start.toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {end &&
                  ` – ${end.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`}
              </span>
              {event.locationName && (
                <span>📍 {event.locationName}</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardBody>
                <h2 className="text-xl font-bold text-presec-blue">
                  About this Event
                </h2>
                <p className="mt-4 text-presec-text whitespace-pre-line">
                  {event.description ||
                    'No description provided yet for this event.'}
                </p>
              </CardBody>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardBody>
                <h3 className="font-bold text-presec-blue">
                  Event Details
                </h3>
                <ul className="mt-4 space-y-3 text-sm">
                  <li>
                    <div className="text-presec-text-muted text-xs uppercase tracking-wide">
                      Price
                    </div>
                    <div className="font-semibold">
                      {Number(event.ticketPrice) === 0
                        ? 'Free'
                        : `${event.currency} ${Number(event.ticketPrice).toLocaleString()}`}
                    </div>
                  </li>
                  {event.maxAttendees && (
                    <li>
                      <div className="text-presec-text-muted text-xs uppercase tracking-wide">
                        Capacity
                      </div>
                      <div>
                        {event.registeredCount ?? 0} / {event.maxAttendees}
                      </div>
                    </li>
                  )}
                  {event.locationAddress && (
                    <li>
                      <div className="text-presec-text-muted text-xs uppercase tracking-wide">
                        Address
                      </div>
                      <div>{event.locationAddress}</div>
                    </li>
                  )}
                </ul>

                <div className="mt-6 pt-4 border-t border-presec-border">
                  <Link
                    href="/login"
                    className="block w-full text-center bg-presec-gold text-presec-blue-dark font-semibold px-4 py-3 rounded-md hover:bg-presec-gold-dark transition-colors"
                  >
                    Register for this Event
                  </Link>
                  <p className="mt-2 text-xs text-presec-text-muted text-center">
                    Login required
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
