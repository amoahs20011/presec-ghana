import { Section } from '@/components/ui/Section';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import type { Project, Paginated } from '@/types';
import Link from 'next/link';

export const metadata = {
  title: 'Projects',
  description:
    'Support PRESEC school development projects — transparent tracking, real impact.',
};

async function getProjects(): Promise<Project[]> {
  try {
    const data = await api.get<Paginated<Project>>(
      '/projects?limit=24',
    );
    return data.items;
  } catch {
    return [];
  }
}

function statusColor(status: string) {
  switch (status) {
    case 'active':
      return 'green' as const;
    case 'completed':
      return 'blue' as const;
    case 'planning':
      return 'yellow' as const;
    case 'paused':
      return 'gray' as const;
    default:
      return 'gray' as const;
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <section className="bg-presec-blue text-white py-12 lg:py-16">
        <div className="container">
          <Badge color="gold">Development</Badge>
          <h1 className="mt-4 text-4xl lg:text-5xl font-bold">
            School Projects
          </h1>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl">
            Support infrastructure and programmes at PRESEC schools across
            Ghana. Every contribution tracked transparently.
          </p>
        </div>
      </section>

      <Section>
        {projects.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-presec-text-muted">
                No projects listed yet.
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const pct =
                project.computedProgress ??
                Math.min(
                  100,
                  (Number(project.raisedAmount) /
                    Number(project.targetAmount)) *
                    100,
                );
              return (
                <Card key={project.id} hover>
                  <Link href={`/projects/${project.id}`}>
                    <CardBody>
                      <div className="flex items-start justify-between">
                        <Badge color="gold">{project.category}</Badge>
                        <Badge color={statusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>

                      <h3 className="mt-3 font-semibold text-lg text-presec-blue line-clamp-2">
                        {project.title}
                      </h3>

                      {project.description && (
                        <p className="mt-2 text-sm text-presec-text-muted line-clamp-3">
                          {project.description}
                        </p>
                      )}

                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-presec-gold h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <div className="mt-2 flex justify-between text-xs text-presec-text-muted">
                          <span className="font-semibold text-presec-blue">
                            {project.currency}{' '}
                            {Number(project.raisedAmount).toLocaleString()}
                          </span>
                          <span>
                            of {project.currency}{' '}
                            {Number(project.targetAmount).toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-presec-text-muted">
                          {pct.toFixed(1)}% funded
                          {project.contributorCount !== undefined &&
                            ` • ${project.contributorCount} contributors`}
                        </div>
                      </div>
                    </CardBody>
                  </Link>
                </Card>
              );
            })}
          </div>
        )}
      </Section>
    </>
  );
}
