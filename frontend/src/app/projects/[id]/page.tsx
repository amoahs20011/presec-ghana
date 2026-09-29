import { Section } from '@/components/ui/Section';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import type { Project } from '@/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';

async function getProject(id: string): Promise<Project | null> {
  try {
    return await api.get<Project>(`/projects/${id}`);
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
  const project = await getProject(id);
  return { title: project?.title || 'Project Not Found' };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) notFound();

  const target = Number(project.targetAmount);
  const raised = Number(project.raisedAmount);
  const pct = Math.min(100, (raised / target) * 100);

  return (
    <>
      <section className="bg-gradient-to-br from-[#172554] to-[#0F172A] text-white py-12 lg:py-16">
        <div className="container">
          <Link
            href="/projects"
            className="text-sm text-gold hover:underline"
          >
            ← Back to Projects
          </Link>
          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              <Badge color="gold">{project.category}</Badge>
              <Badge color="blue">{project.status}</Badge>
            </div>
            <h1 className="mt-3 text-3xl lg:text-4xl font-bold">
              {project.title}
            </h1>
            {project.school && (
              <p className="mt-2 text-gray-200">{project.school.name}</p>
            )}
          </div>
        </div>
      </section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardBody>
                <h2 className="text-xl font-bold text-white">
                  About this Project
                </h2>
                <p className="mt-4 text-slate-200 whitespace-pre-line">
                  {project.description ||
                    'No description provided yet for this project.'}
                </p>
              </CardBody>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardBody>
                <h3 className="font-bold text-white">
                  Funding Progress
                </h3>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-presec-gold h-3 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-3 text-sm">
                    <div className="text-slate-400 text-xs uppercase tracking-wide">
                      Raised
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {project.currency} {raised.toLocaleString()}
                    </div>
                    <div className="text-slate-400 mt-1">
                      of {project.currency} {target.toLocaleString()}
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                    <div className="bg-[#0F172A] rounded p-3">
                      <div className="text-lg font-bold text-white">
                        {pct.toFixed(1)}%
                      </div>
                      <div className="text-xs text-slate-400">
                        Funded
                      </div>
                    </div>
                    <div className="bg-[#0F172A] rounded p-3">
                      <div className="text-lg font-bold text-white">
                        {project.contributorCount ?? 0}
                      </div>
                      <div className="text-xs text-slate-400">
                        Contributors
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700">
                  <Link
                    href="/login"
                    className="block w-full text-center bg-presec-gold text-white-dark font-semibold px-4 py-3 rounded-md hover:bg-presec-gold-dark transition-colors"
                  >
                    Contribute to this Project
                  </Link>
                  <p className="mt-2 text-xs text-slate-400 text-center">
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
