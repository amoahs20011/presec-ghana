import { Section } from '@/components/ui/Section';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import type { School } from '@/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';

async function getSchool(id: string): Promise<School | null> {
  try {
    return await api.get<School>(`/schools/${id}`);
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
  const school = await getSchool(id);
  return {
    title: school?.name || 'School Not Found',
  };
}

export default async function SchoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const school = await getSchool(id);

  if (!school) {
    notFound();
  }

  return (
    <>
      <section className="bg-presec-blue text-white py-12 lg:py-16">
        <div className="container">
          <Link
            href="/schools"
            className="text-sm text-presec-gold hover:underline"
          >
            ← Back to Schools
          </Link>

          <div className="mt-6 flex items-start gap-6">
            <div className="w-20 h-20 bg-presec-gold text-presec-blue-dark rounded-full flex items-center justify-center font-bold text-3xl flex-shrink-0">
              {school.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">
                {school.name}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2">
                {school.code && (
                  <Badge color="gold">Code: {school.code}</Badge>
                )}
                {school.type && <Badge color="blue">{school.type}</Badge>}
                {school.establishedYear && (
                  <Badge color="gray-dark">
                    Est. {school.establishedYear}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardBody>
                <h2 className="text-xl font-bold text-presec-blue">
                  About this School
                </h2>
                <p className="mt-4 text-presec-text">
                  {school.description ||
                    'No description provided yet for this school.'}
                </p>

                {school.district && (
                  <div className="mt-6 pt-6 border-t border-presec-border">
                    <h3 className="text-sm uppercase tracking-wide text-presec-text-muted font-semibold">
                      Location
                    </h3>
                    <p className="mt-2 text-presec-text">
                      📍 {school.district.name}
                      {school.district.region?.name && (
                        <>
                          , {school.district.region.name} Region
                        </>
                      )}
                    </p>
                    {school.address && (
                      <p className="mt-1 text-sm text-presec-text-muted">
                        {school.address}
                      </p>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          <div>
            <Card>
              <CardBody>
                <h3 className="font-bold text-presec-blue">
                  Contact Information
                </h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {school.phone && (
                    <li>
                      <span className="text-presec-text-muted">Phone:</span>{' '}
                      {school.phone}
                    </li>
                  )}
                  {school.email && (
                    <li>
                      <span className="text-presec-text-muted">Email:</span>{' '}
                      {school.email}
                    </li>
                  )}
                  {school.website && (
                    <li>
                      <span className="text-presec-text-muted">
                        Website:
                      </span>{' '}
                      <a
                        href={school.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-presec-blue hover:underline"
                      >
                        Visit
                      </a>
                    </li>
                  )}
                  {!school.phone &&
                    !school.email &&
                    !school.website && (
                      <li className="text-presec-text-muted">
                        No contact info yet.
                      </li>
                    )}
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
