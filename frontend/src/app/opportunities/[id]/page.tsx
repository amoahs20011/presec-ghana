import { Section } from '@/components/ui/Section';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import type { Opportunity } from '@/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface OpportunityDetail extends Opportunity {
  applicationCount?: number;
}

async function getOpportunity(
  id: string,
): Promise<OpportunityDetail | null> {
  try {
    return await api.get<OpportunityDetail>(`/opportunities/${id}`);
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
  const opp = await getOpportunity(id);
  return { title: opp?.title || 'Opportunity Not Found' };
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opp = await getOpportunity(id);

  if (!opp) notFound();

  return (
    <>
      <section className="bg-presec-blue text-white py-12 lg:py-16">
        <div className="container">
          <Link
            href="/opportunities"
            className="text-sm text-presec-gold hover:underline"
          >
            ← Back to Opportunities
          </Link>
          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              <Badge color="gold">{opp.type.replace('_', ' ')}</Badge>
              {opp.jobType && (
                <Badge color="blue">
                  {opp.jobType.replace('_', ' ')}
                </Badge>
              )}
            </div>
            <h1 className="mt-3 text-3xl lg:text-4xl font-bold">
              {opp.title}
            </h1>
            {opp.companyName && (
              <p className="mt-2 text-lg text-gray-200">
                {opp.companyName}
              </p>
            )}
          </div>
        </div>
      </section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardBody>
                <h2 className="text-xl font-bold text-presec-blue">
                  Description
                </h2>
                <p className="mt-4 text-presec-text whitespace-pre-line">
                  {opp.description || 'No description provided.'}
                </p>
              </CardBody>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardBody>
                <h3 className="font-bold text-presec-blue">
                  Opportunity Details
                </h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {opp.location && (
                    <li>
                      <div className="text-presec-text-muted text-xs uppercase tracking-wide">
                        Location
                      </div>
                      <div>{opp.location}</div>
                    </li>
                  )}
                  {opp.industry && (
                    <li>
                      <div className="text-presec-text-muted text-xs uppercase tracking-wide">
                        Industry
                      </div>
                      <div>{opp.industry}</div>
                    </li>
                  )}
                  {opp.salaryRange && (
                    <li>
                      <div className="text-presec-text-muted text-xs uppercase tracking-wide">
                        Salary
                      </div>
                      <div>{opp.salaryRange}</div>
                    </li>
                  )}
                  {opp.deadline && (
                    <li>
                      <div className="text-presec-text-muted text-xs uppercase tracking-wide">
                        Deadline
                      </div>
                      <div>
                        {new Date(opp.deadline).toLocaleDateString(
                          'en-GB',
                          {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          },
                        )}
                      </div>
                    </li>
                  )}
                  {opp.applicationCount !== undefined && (
                    <li>
                      <div className="text-presec-text-muted text-xs uppercase tracking-wide">
                        Applications
                      </div>
                      <div>{opp.applicationCount}</div>
                    </li>
                  )}
                </ul>

                <div className="mt-6 pt-4 border-t border-presec-border">
                  <Link
                    href="/login"
                    className="block w-full text-center bg-presec-gold text-presec-blue-dark font-semibold px-4 py-3 rounded-md hover:bg-presec-gold-dark transition-colors"
                  >
                    Apply Now
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
