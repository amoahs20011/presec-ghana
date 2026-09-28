import { Section } from '@/components/ui/Section';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';

export const metadata = {
  title: 'About',
  description:
    'Learn about PRESEC GHANA — the digital home of Presbyterian Secondary School alumni, students, and staff across Ghana.',
};

const values = [
  {
    title: 'Community',
    description:
      'Bringing together all PRESEC generations under one platform.',
    icon: '🤝',
  },
  {
    title: 'Heritage',
    description: 'Preserving and celebrating our shared history.',
    icon: '📜',
  },
  {
    title: 'Opportunity',
    description:
      'Creating pathways for personal and professional growth.',
    icon: '🚀',
  },
  {
    title: 'Transparency',
    description: 'Open tracking of projects, funds, and progress.',
    icon: '🔍',
  },
  {
    title: 'Excellence',
    description:
      'Upholding the standards and reputation of PRESEC.',
    icon: '🏆',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-presec-blue text-white py-16 lg:py-24">
        <div className="container">
          <Badge color="gold">About PRESEC GHANA</Badge>
          <h1 className="mt-4 text-4xl lg:text-5xl font-bold max-w-3xl">
            One Community.
            <br />
            Many Generations.
            <br />
            <span className="text-presec-gold">One Future.</span>
          </h1>
          <p className="mt-6 text-lg text-gray-200 max-w-2xl">
            PRESEC GHANA is the digital home of Presbyterian Secondary
            School alumni, students, teachers, and staff across all 16
            regions of Ghana.
          </p>
        </div>
      </section>

      {/* Mission */}
      <Section title="Our Mission">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="prose max-w-none text-presec-text">
            <p className="text-lg leading-relaxed">
              To create a unified digital home for the entire PRESEC
              community — preserving history, enabling lifelong
              connections, creating opportunities, and supporting the
              development of every PRESEC school in Ghana.
            </p>
            <p className="mt-4 text-lg leading-relaxed">
              We begin with <strong>PRESEC Tema Community 11</strong> in
              the Tema District of Greater Accra, and are architected to
              support every PRESEC branch across Ghana.
            </p>
          </div>
          <Card>
            <CardBody>
              <h3 className="font-bold text-presec-blue text-lg">
                What we serve
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>✅ Alumni directory &amp; networking</li>
                <li>✅ Year group communities</li>
                <li>✅ Events, reunions &amp; homecomings</li>
                <li>✅ Jobs, internships &amp; scholarships</li>
                <li>✅ Mentorship matching</li>
                <li>✅ Alumni business directory</li>
                <li>✅ School development projects</li>
                <li>✅ Heritage archive &amp; gallery</li>
                <li>✅ News &amp; announcements</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </Section>

      {/* Values */}
      <Section
        bg="alt"
        title="Our Values"
        subtitle="The principles that guide everything we build"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((value) => (
            <Card key={value.title} hover>
              <CardBody>
                <div className="text-4xl">{value.icon}</div>
                <h3 className="mt-3 font-semibold text-lg text-presec-blue">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-presec-text-muted">
                  {value.description}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>

      {/* Vision */}
      <Section title="Our Vision">
        <Card>
          <CardBody>
            <blockquote className="border-l-4 border-presec-gold pl-6 italic text-lg text-presec-text">
              &ldquo;To be the definitive digital ecosystem where every
              PRESEC alumnus, student, and teacher stays connected for
              life — celebrating our past, empowering our present, and
              building our future together.&rdquo;
            </blockquote>
          </CardBody>
        </Card>
      </Section>

      {/* CTA */}
      <section className="bg-presec-gold py-16">
        <div className="container text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-presec-blue-dark">
            Be part of the story
          </h2>
          <p className="mt-3 text-lg text-presec-blue-dark/80 max-w-2xl mx-auto">
            Whether you graduated last year or fifty years ago — your
            PRESEC story belongs here.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <ButtonLink href="/register" variant="primary" size="lg">
              Join PRESEC GHANA
            </ButtonLink>
            <ButtonLink href="/schools" variant="outline" size="lg">
              Explore Schools
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
