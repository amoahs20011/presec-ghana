import { Section } from '@/components/ui/Section';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import type { Opportunity, Paginated } from '@/types';
import Link from 'next/link';

export const metadata = {
  title: 'Opportunities',
  description:
    'Jobs, internships, scholarships, and training opportunities for PRESEC alumni and students.',
};

async function getOpportunities(): Promise<Opportunity[]> {
  try {
    const data = await api.get<Paginated<Opportunity>>(
      '/opportunities?limit=24',
    );
    return data.items;
  } catch {
    return [];
  }
}

function typeColor(type: string) {
  switch (type) {
    case 'job':
      return 'blue' as const;
    case 'internship':
      return 'gold' as const;
    case 'scholarship':
      return 'green' as const;
    case 'training':
      return 'yellow' as const;
    case 'national_service':
      return 'gray-dark' as const;
    default:
      return 'gray' as const;
  }
}

export default async function OpportunitiesPage() {
  const opps = await getOpportunities();

  return (
    <>
      <section className="bg-presec-blue text-white py-12 lg:py-16">
        <div className="container">
          <Badge color="gold">Career & Growth</Badge>
          <h1 className="mt-4 text-4xl lg:text-5xl font-bold">
            Opportunities
          </h1>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl">
            Jobs, internships, scholarships, and training programmes — for
            PRESEC alumni and current students.
          </p>
        </div>
      </section>

      <Section>
        {opps.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-presec-text-muted">
                No opportunities posted yet.
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {opps.map((opp) => (
              <Card key={opp.id} hover>
                <Link href={`/opportunities/${opp.id}`}>
                  <CardBody>
                    <div className="flex items-start justify-between gap-2">
                      <Badge color={typeColor(opp.type)}>
                        {opp.type.replace('_', ' ')}
                      </Badge>
                      {opp.jobType && (
                        <Badge color="gray">
                          {opp.jobType.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>

                    <h3 className="mt-3 font-semibold text-lg text-presec-blue line-clamp-2">
                      {opp.title}
                    </h3>

                    {opp.companyName && (
                      <p className="mt-1 text-sm font-medium text-presec-text">
                        {opp.companyName}
                      </p>
                    )}

                    <div className="mt-3 space-y-1 text-sm text-presec-text-muted">
                      {opp.location && <p>📍 {opp.location}</p>}
                      {opp.industry && <p>🏢 {opp.industry}</p>}
                      {opp.salaryRange && (
                        <p>💰 {opp.salaryRange}</p>
                      )}
                      {opp.deadline && (
                        <p>
                          ⏰ Deadline:{' '}
                          {new Date(opp.deadline).toLocaleDateString(
                            'en-GB',
                          )}
                        </p>
                      )}
                    </div>
                  </CardBody>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
