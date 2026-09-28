import { Section } from '@/components/ui/Section';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import Link from 'next/link';

export const metadata = {
  title: 'Mentorship',
  description:
    'Connect with experienced PRESEC alumni mentors across industries.',
};

interface MentorshipOffer {
  id: string;
  area: string;
  description: string | null;
  maxMentees: number;
  currentMentees: number;
  mentor?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

async function getOffers(): Promise<MentorshipOffer[]> {
  try {
    return await api.get<MentorshipOffer[]>('/mentorship/offers');
  } catch {
    return [];
  }
}

export default async function MentorshipPage() {
  const offers = await getOffers();

  return (
    <>
      <section className="bg-presec-blue text-white py-12 lg:py-16">
        <div className="container">
          <Badge color="gold">Mentorship</Badge>
          <h1 className="mt-4 text-4xl lg:text-5xl font-bold">
            Find a Mentor
          </h1>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl">
            Connect with experienced PRESEC alumni who are ready to guide
            the next generation.
          </p>
          <div className="mt-6">
            <Link
              href="/login"
              className="inline-block bg-presec-gold text-presec-blue-dark font-semibold px-6 py-3 rounded-md hover:bg-presec-gold-dark transition-colors"
            >
              Become a Mentor
            </Link>
          </div>
        </div>
      </section>

      <Section>
        {offers.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-presec-text-muted">
                No mentors available yet. Be the first to offer
                mentorship!
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <Card key={offer.id} hover>
                <CardBody>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-presec-blue text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {offer.mentor?.firstName?.charAt(0)}
                      {offer.mentor?.lastName?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-presec-blue">
                        {offer.mentor?.firstName}{' '}
                        {offer.mentor?.lastName}
                      </h3>
                      <p className="text-sm text-presec-text-muted">
                        Mentor
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Badge color="gold">{offer.area}</Badge>
                  </div>

                  {offer.description && (
                    <p className="mt-3 text-sm text-presec-text line-clamp-3">
                      {offer.description}
                    </p>
                  )}

                  <div className="mt-4 pt-4 border-t border-presec-border flex justify-between items-center">
                    <span className="text-xs text-presec-text-muted">
                      {offer.currentMentees} / {offer.maxMentees} mentees
                    </span>
                    <Link
                      href="/login"
                      className="text-sm font-semibold text-presec-blue hover:underline"
                    >
                      Request Mentorship →
                    </Link>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
