import { Section } from '@/components/ui/Section';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import type { Business, Paginated } from '@/types';
import Link from 'next/link';

export const metadata = {
  title: 'Business Directory',
  description:
    'Discover and support businesses owned by PRESEC alumni.',
};

async function getBusinesses(): Promise<Business[]> {
  try {
    const data = await api.get<Paginated<Business>>(
      '/businesses?limit=24',
    );
    return data.items;
  } catch {
    return [];
  }
}

export default async function BusinessesPage() {
  const businesses = await getBusinesses();

  return (
    <>
      <section className="bg-presec-blue text-white py-12 lg:py-16">
        <div className="container">
          <Badge color="gold">PRESEC Network</Badge>
          <h1 className="mt-4 text-4xl lg:text-5xl font-bold">
            Alumni Businesses
          </h1>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl">
            Support the PRESEC economic network. Discover businesses
            owned and run by fellow alumni.
          </p>
          <div className="mt-6">
            <Link
              href="/login"
              className="inline-block bg-presec-gold text-presec-blue-dark font-semibold px-6 py-3 rounded-md hover:bg-presec-gold-dark transition-colors"
            >
              List Your Business
            </Link>
          </div>
        </div>
      </section>

      <Section>
        {businesses.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-presec-text-muted">
                No businesses listed yet. Be the first!
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((biz) => (
              <Card key={biz.id} hover>
                <CardBody>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-lg bg-presec-gold text-presec-blue-dark flex items-center justify-center font-bold text-xl flex-shrink-0">
                      {biz.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-presec-blue truncate">
                          {biz.name}
                        </h3>
                        {biz.isVerified && (
                          <span className="text-green-600 text-xs">
                            ✓
                          </span>
                        )}
                      </div>
                      {biz.industry && (
                        <p className="text-sm text-presec-text-muted">
                          {biz.industry}
                        </p>
                      )}
                    </div>
                  </div>

                  {biz.description && (
                    <p className="mt-3 text-sm text-presec-text line-clamp-3">
                      {biz.description}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-presec-text-muted">
                    {biz.location && <span>📍 {biz.location}</span>}
                  </div>

                  <div className="mt-4 pt-4 border-t border-presec-border flex justify-between items-center">
                    {biz.isVerified ? (
                      <Badge color="green">✓ Verified</Badge>
                    ) : (
                      <Badge color="gray">Unverified</Badge>
                    )}
                    {biz.website && (
                      <a
                        href={biz.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-presec-blue hover:underline"
                      >
                        Visit →
                      </a>
                    )}
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
