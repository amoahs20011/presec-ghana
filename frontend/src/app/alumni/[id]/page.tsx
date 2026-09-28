import { Section } from '@/components/ui/Section';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import type { Alumni } from '@/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';

async function getAlumni(id: string): Promise<Alumni | null> {
  try {
    return await api.get<Alumni>(`/alumni/${id}`);
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
  const person = await getAlumni(id);
  const name = person?.user
    ? `${person.user.firstName} ${person.user.lastName}`
    : 'Alumni Profile';
  return { title: name };
}

export default async function AlumniDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = await getAlumni(id);

  if (!person) notFound();

  const fullName = person.user
    ? `${person.user.firstName} ${person.user.lastName}`
    : 'Anonymous Alumni';

  const initials = person.user
    ? `${person.user.firstName?.[0] || ''}${person.user.lastName?.[0] || ''}`
    : '?';

  return (
    <>
      <section className="bg-presec-blue text-white py-12 lg:py-16">
        <div className="container">
          <Link
            href="/alumni"
            className="text-sm text-presec-gold hover:underline"
          >
            ← Back to Directory
          </Link>

          <div className="mt-6 flex items-start gap-6">
            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-presec-gold text-presec-blue-dark rounded-full flex items-center justify-center font-bold text-3xl flex-shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">
                {fullName}
              </h1>
              {person.currentProfession && (
                <p className="mt-2 text-lg text-gray-200">
                  {person.currentProfession}
                  {person.currentEmployer &&
                    ` at ${person.currentEmployer}`}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {person.graduationYear && (
                  <Badge color="gold">
                    Class of {person.graduationYear}
                  </Badge>
                )}
                {person.programme && (
                  <Badge color="blue">{person.programme}</Badge>
                )}
                {person.verificationStatus === 'verified' && (
                  <Badge color="green">✓ Verified</Badge>
                )}
                {person.isAvailableForMentorship && (
                  <Badge color="yellow">Available for Mentorship</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {person.bio && (
              <Card>
                <CardBody>
                  <h2 className="font-bold text-presec-blue">About</h2>
                  <p className="mt-3 text-presec-text whitespace-pre-line">
                    {person.bio}
                  </p>
                </CardBody>
              </Card>
            )}

            {person.skills && person.skills.length > 0 && (
              <Card>
                <CardBody>
                  <h2 className="font-bold text-presec-blue">Skills</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {person.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-sm px-3 py-1 bg-presec-bg-alt rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {person.isAvailableForMentorship &&
              person.mentorshipAreas &&
              person.mentorshipAreas.length > 0 && (
                <Card>
                  <CardBody>
                    <h2 className="font-bold text-presec-blue">
                      Mentorship Areas
                    </h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {person.mentorshipAreas.map((area) => (
                        <Badge key={area} color="gold">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardBody>
                <h3 className="font-bold text-presec-blue">
                  Quick Info
                </h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {person.school && (
                    <li>
                      <div className="text-presec-text-muted text-xs uppercase tracking-wide">
                        School
                      </div>
                      <div>{person.school.name}</div>
                    </li>
                  )}
                  {person.yearGroup && (
                    <li>
                      <div className="text-presec-text-muted text-xs uppercase tracking-wide">
                        Year Group
                      </div>
                      <div>{person.yearGroup.name}</div>
                    </li>
                  )}
                  {person.industry && (
                    <li>
                      <div className="text-presec-text-muted text-xs uppercase tracking-wide">
                        Industry
                      </div>
                      <div>{person.industry}</div>
                    </li>
                  )}
                  {person.locationCity && (
                    <li>
                      <div className="text-presec-text-muted text-xs uppercase tracking-wide">
                        Location
                      </div>
                      <div>
                        {person.locationCity}
                        {person.locationCountry &&
                          `, ${person.locationCountry}`}
                      </div>
                    </li>
                  )}
                </ul>

                <div className="mt-6 pt-4 border-t border-presec-border space-y-2">
                  {person.linkedinUrl && (
                    <a
                      href={person.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-presec-blue hover:underline"
                    >
                      🔗 LinkedIn
                    </a>
                  )}
                  {person.websiteUrl && (
                    <a
                      href={person.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-presec-blue hover:underline"
                    >
                      🌐 Website
                    </a>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
