import Link from 'next/link';
import {
  ArrowLeft,
  Target,
  Users,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Building2,
  Heart,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { GradientCard, GradientCardBody, GradientIcon } from '@/components/ui/GradientCard';
import { api } from '@/lib/api';
import type { Project } from '@/types';
import { notFound } from 'next/navigation';

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

  const target = Number(project.targetAmount || 1);
  const raised = Number(project.raisedAmount || 0);
  const pct =
    project.computedProgress ??
    project.progressPercentage ??
    Math.min(100, Math.round((raised / target) * 100));

  const remaining = Math.max(0, target - raised);
  const isComplete = pct >= 100;

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#172554] via-[#1E3A8A] to-[#0F172A] py-16">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />

          <div className="container relative">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-gold transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.category && (
                <Badge color="gold" size="md">
                  {project.category}
                </Badge>
              )}
              <Badge color={isComplete ? 'green' : 'blue'} size="md">
                {project.status}
              </Badge>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 max-w-4xl">
              {project.title}
            </h1>

            {project.school && (
              <p className="text-lg text-slate-300 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gold" />
                {project.school.name}
              </p>
            )}

            {/* Cover */}
            {project.coverPhotoUrl && (
              <div className="mt-8 rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={project.coverPhotoUrl}
                  alt={project.title}
                  className="w-full h-64 lg:h-96 object-cover"
                />
              </div>
            )}
          </div>
        </section>

        {/* CONTENT */}
        <section className="container py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT: Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <GradientCard theme="emerald" hover={false}>
                <GradientCardBody className="p-6">
                  <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <GradientIcon theme="emerald" size="sm">
                      <Target className="w-5 h-5" />
                    </GradientIcon>
                    About this Project
                  </h2>
                  <p className="text-slate-300 whitespace-pre-line leading-relaxed">
                    {project.description ||
                      'No description provided yet for this project.'}
                  </p>
                </GradientCardBody>
              </GradientCard>

              {/* Progress detail */}
              <GradientCard theme="cyan" hover={false}>
                <GradientCardBody className="p-6">
                  <h2 className="font-display text-xl font-bold text-white mb-5 flex items-center gap-3">
                    <GradientIcon theme="cyan" size="sm">
                      <TrendingUp className="w-5 h-5" />
                    </GradientIcon>
                    Funding Progress
                  </h2>

                  <div className="mb-5">
                    <div className="flex justify-between text-sm mb-3">
                      <span className="font-bold text-white text-lg">
                        GH₵ {raised.toLocaleString()}
                      </span>
                      <span className="text-slate-400">
                        of GH₵ {target.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-center">
                      <div className="text-2xl font-extrabold text-emerald-400 mb-1">
                        {Math.round(pct)}%
                      </div>
                      <div className="text-2xs text-slate-500 uppercase tracking-wider">
                        Funded
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-center">
                      <div className="text-2xl font-extrabold text-cyan-400 mb-1">
                        {project.contributorCount || 0}
                      </div>
                      <div className="text-2xs text-slate-500 uppercase tracking-wider">
                        Contributors
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-center">
                      <div className="text-2xl font-extrabold text-gold mb-1">
                        GH₵ {remaining.toLocaleString()}
                      </div>
                      <div className="text-2xs text-slate-500 uppercase tracking-wider">
                        Remaining
                      </div>
                    </div>
                  </div>
                </GradientCardBody>
              </GradientCard>
            </div>

            {/* RIGHT: Support card */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <GradientCard theme="gold" hover={false}>
                  <GradientCardBody className="p-6">
                    <div className="text-center mb-5">
                      <GradientIcon theme="gold" size="md" className="mx-auto mb-3">
                        <Heart className="w-6 h-6" />
                      </GradientIcon>
                      <h3 className="font-display text-xl font-bold text-white mb-1">
                        Support this Project
                      </h3>
                      <p className="text-sm text-slate-400">
                        Every contribution counts
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 mb-5">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                        Amount Raised
                      </div>
                      <div className="text-2xl font-extrabold text-white mb-1">
                        GH₵ {raised.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400">
                        {project.contributorCount || 0} contributor
                        {project.contributorCount !== 1 ? 's' : ''}
                      </div>
                    </div>

                    <ButtonLink
                      href={`/projects/${project.id}/contribute`}
                      variant="gradient"
                      size="lg"
                      fullWidth
                      icon={<Sparkles className="w-4 h-4" />}
                    >
                      Contribute Now
                    </ButtonLink>

                    <p className="text-xs text-slate-500 text-center mt-3">
                      Login required
                    </p>
                  </GradientCardBody>
                </GradientCard>

                {/* Trust badges */}
                <div className="mt-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Transparent tracking
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Real-time progress
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Direct school impact
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-cyan-600 to-blue-600 p-10 md:p-14">
            <div className="absolute inset-0 bg-slate-900/40" />
            <div className="relative max-w-2xl">
              <Badge
                color="gold"
                size="lg"
                className="mb-4 bg-white/20 border-white/30 text-white backdrop-blur"
              >
                <Target className="w-3.5 h-3.5" />
                Make a Difference
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Help us reach 100%
              </h2>
              <p className="text-lg text-white/90 mb-6">
                Your support helps complete this project and brings us closer
                to a better PRESEC for future generations.
              </p>
              <ButtonLink
                href={`/projects/${project.id}/contribute`}
                variant="gradient"
                size="lg"
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                Contribute Now
              </ButtonLink>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
