import { Section } from '@/components/ui/Section';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import type { School } from '@/types';
import Link from 'next/link';

export const metadata = {
  title: 'Schools',
  description:
    'Directory of all PRESEC (Presbyterian Secondary School) branches across Ghana.',
};

async function getSchools(): Promise<School[]> {
  try {
    const data = await api.get<School[]>('/schools');
    return data;
  } catch {
    return [];
  }
}

export default async function SchoolsPage() {
  const schools = await getSchools();

  return (
    <>
      <section className="bg-presec-blue text-white py-12 lg:py-16">
        <div className="container">
          <Badge color="gold">PRESEC Schools</Badge>
          <h1 className="mt-4 text-4xl lg:text-5xl font-bold">
            Our Schools
          </h1>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl">
            Every PRESEC branch across Ghana — a network of excellence,
            tradition, and community.
          </p>
        </div>
      </section>

      <Section>
        {schools.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-presec-text-muted">
                No schools have been added yet.
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => (
              <Card key={school.id} hover>
                <Link href={`/schools/${school.id}`}>
                  <CardBody>
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 bg-presec-blue text-white rounded-full flex items-center justify-center font-bold text-xl">
                        {school.name.charAt(0)}
                      </div>
                      {school.type && (
                        <Badge color="gray">{school.type}</Badge>
                      )}
                    </div>

                    <h3 className="mt-4 font-semibold text-lg text-presec-blue line-clamp-2">
                      {school.name}
                    </h3>

                    {school.code && (
                      <p className="mt-1 text-xs text-presec-text-muted">
                        Code: {school.code}
                      </p>
                    )}

                    {school.district && (
                      <p className="mt-3 text-sm text-presec-text-muted">
                        📍 {school.district.name}
                        {school.district.region?.name &&
                          `, ${school.district.region.name}`}
                      </p>
                    )}

                    {school.establishedYear && (
                      <p className="text-sm text-presec-text-muted">
                        🎓 Established {school.establishedYear}
                      </p>
                    )}

                    {school.description && (
                      <p className="mt-3 text-sm text-presec-text line-clamp-3">
                        {school.description}
                      </p>
                    )}
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
