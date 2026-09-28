import { Section } from '@/components/ui/Section';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const metadata = {
  title: 'Heritage',
  description:
    'The PRESEC digital museum — photos, documents, and memories from our history.',
};

interface HeritageItem {
  id: string;
  type: string;
  title: string;
  description: string | null;
  fileUrl: string | null;
  thumbnailUrl: string | null;
  yearEstimate: number | null;
  source: string | null;
}

interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string | null;
  year: number | null;
  photoUrl: string | null;
}

async function getHeritage(): Promise<{
  items: HeritageItem[];
  achievements: Achievement[];
}> {
  try {
    const [items, achievements] = await Promise.all([
      api.get<HeritageItem[]>('/heritage'),
      api.get<Achievement[]>('/heritage/achievements'),
    ]);
    return { items, achievements };
  } catch {
    return { items: [], achievements: [] };
  }
}

export default async function HeritagePage() {
  const { items, achievements } = await getHeritage();

  // Group heritage items by decade
  const decades: Record<number, HeritageItem[]> = {};
  items.forEach((item) => {
    if (item.yearEstimate) {
      const decade = Math.floor(item.yearEstimate / 10) * 10;
      if (!decades[decade]) decades[decade] = [];
      decades[decade].push(item);
    }
  });

  const sortedDecades = Object.keys(decades)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <>
      <section className="bg-presec-blue text-white py-12 lg:py-16">
        <div className="container">
          <Badge color="gold">Digital Museum</Badge>
          <h1 className="mt-4 text-4xl lg:text-5xl font-bold">
            PRESEC Heritage
          </h1>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl">
            Preserving our history, one memory at a time. Photos,
            documents, and stories from generations of PRESEC alumni.
          </p>
        </div>
      </section>

      {items.length === 0 && achievements.length === 0 ? (
        <Section>
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-presec-text-muted">
                The heritage archive is being built. Contributions
                welcome!
              </p>
            </CardBody>
          </Card>
        </Section>
      ) : (
        <>
          {sortedDecades.length > 0 && (
            <Section title="Through the Decades">
              {sortedDecades.map((decade) => (
                <div key={decade} className="mb-12 last:mb-0">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-3xl font-bold text-presec-gold">
                      {decade}s
                    </div>
                    <div className="flex-1 border-t border-presec-border" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {decades[decade].map((item) => (
                      <Card key={item.id} hover>
                        <CardBody>
                          <Badge color="gray">{item.type}</Badge>
                          <h3 className="mt-3 font-semibold text-presec-blue line-clamp-2">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="mt-2 text-sm text-presec-text-muted line-clamp-3">
                              {item.description}
                            </p>
                          )}
                          {item.yearEstimate && (
                            <p className="mt-3 text-xs text-presec-text-muted">
                              c. {item.yearEstimate}
                            </p>
                          )}
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </Section>
          )}

          {achievements.length > 0 && (
            <Section
              bg="alt"
              title="Achievements"
              subtitle="Celebrating excellence across generations"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((a) => (
                  <Card key={a.id}>
                    <CardBody>
                      <div className="flex items-start justify-between gap-2">
                        <Badge color="gold">{a.type}</Badge>
                        {a.year && (
                          <span className="text-sm font-semibold text-presec-blue">
                            {a.year}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-3 font-semibold text-presec-blue">
                        {a.title}
                      </h3>
                      {a.description && (
                        <p className="mt-2 text-sm text-presec-text-muted">
                          {a.description}
                        </p>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </div>
            </Section>
          )}
        </>
      )}
    </>
  );
}
