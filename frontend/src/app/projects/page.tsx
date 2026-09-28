import Link from 'next/link';
import {
  Heart,
  Building2,
  TrendingUp,
  Users,
  ArrowRight,
  Target,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { GradientCard, GradientCardBody } from '@/components/ui/GradientCard';
import { api } from '@/lib/api';
import type { Project, Paginated } from '@/types';

export const metadata = {
  title: 'Projects',
  description:
    'Support PRESEC school development projects — transparent tracking, real impact.',
};

async function getProjects(): Promise<Project[]> {
  try {
    const data = await api.get<Paginated<Project>>('/projects?limit=24');
    return data.items;
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  const totalRaised = projects.reduce(
    (sum, p) => sum + Number(p.raisedAmount || 0),
    0,
  );
  const totalTarget = projects.reduce(
    (sum, p) => sum + Number(p.targetAmount || 0),
    0,
  );
  const totalContributors = projects.reduce(
    (sum, p) => sum + (p.contributorCount || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative container py-12">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge
            color="gold"
            size="lg"
            className="mb-4 bg-gold/20 border-gold/40 text-gold-light"
          >
            <Heart className="w-3.5 h-3.5" />
            Give Back
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Building the{' '}
            <span className="gradient-text-gold">Future Together</span>
          </h1>
          <p className="text-lg text-slate-400">
            Support school development projects. See exactly where your
            contributions go.
          </p>
        </div>

        {/* STATS BAR */}
        {projects.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <GradientCard theme="emerald" hover={false}>
              <GradientCardBody className="p-5 text-center">
                <div className="font-display text-2xl font-extrabold text-white mb-1">
                  GH₵ {totalRaised.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  Total Raised
                </div>
              </GradientCardBody>
            </GradientCard>
            <GradientCard theme="cyan" hover={false}>
              <GradientCardBody className="p-5 text-center">
                <div className="font-display text-2xl font-extrabold text-white mb-1">
                  {projects.length}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  Active Projects
                </div>
              </GradientCardBody>
            </GradientCard>
            <GradientCard theme="violet" hover={false}>
              <GradientCardBody className="p-5 text-center">
                <div className="font-display text-2xl font-extrabold text-white mb-1">
                  {totalContributors}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  Contributors
                </div>
              </GradientCardBody>
            </GradientCard>
            <GradientCard theme="gold" hover={false}>
              <GradientCardBody className="p-5 text-center">
                <div className="font-display text-2xl font-extrabold text-white mb-1">
                  {Math.round((totalRaised / totalTarget) * 100) || 0}%
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  Overall Progress
                </div>
              </GradientCardBody>
            </GradientCard>
          </div>
        )}

        {/* EMPTY */}
        {projects.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800 flex items-center justify-center">
              <Building2 className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2">
              No active projects
            </h3>
            <p className="text-slate-400 mb-6">
              Check back soon for new development projects.
            </p>
            <ButtonLink href="/" variant="gradient">
              Back to Home
            </ButtonLink>
          </div>
        )}

        {/* PROJECTS GRID */}
        {projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => {
              const themes = [
                'emerald',
                'cyan',
                'gold',
                'violet',
                'sunset',
                'ocean',
              ] as const;
              const theme = themes[index % themes.length];

              const raised = Number(project.raisedAmount || 0);
              const target = Number(project.targetAmount || 1);
              const progress =
                project.computedProgress ??
                project.progressPercentage ??
                Math.round((raised / target) * 100);

              const gradientMap = {
                emerald: 'from-emerald-500 to-cyan-500',
                cyan: 'from-cyan-500 to-blue-500',
                gold: 'from-amber-500 to-orange-500',
                violet: 'from-violet-500 to-pink-500',
                sunset: 'from-orange-500 to-pink-500',
                ocean: 'from-blue-500 to-emerald-500',
              };

              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="block group"
                >
                  <GradientCard theme={theme} className="h-full">
                    <GradientCardBody className="p-0 h-full flex flex-col">
                      {/* COVER */}
                      <div className="relative h-44 overflow-hidden rounded-t-2xl">
                        {project.coverPhotoUrl ? (
                          <img
                            src={project.coverPhotoUrl}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div
                            className={`w-full h-full bg-gradient-to-br ${gradientMap[theme]} flex items-center justify-center opacity-80`}
                          >
                            <Building2 className="w-16 h-16 text-white/40" />
                          </div>
                        )}

                        {/* Progress badge */}
                        <div className="absolute top-4 right-4">
                          <Badge
                            color={progress >= 100 ? 'green' : 'gold'}
                            size="sm"
                            className="bg-slate-900/90 backdrop-blur"
                          >
                            {Math.round(progress)}% funded
                          </Badge>
                        </div>

                        {/* Category badge */}
                        {project.category && (
                          <div className="absolute top-4 left-4">
                            <Badge color={theme as any} size="sm">
                              {project.category}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* BODY */}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-display font-bold text-lg text-white mb-2 line-clamp-2">
                          {project.title}
                        </h3>

                        {project.description && (
                          <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                            {project.description}
                          </p>
                        )}

                        {/* Progress bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-xs mb-2">
                            <span className="font-bold text-emerald-400">
                              GH₵ {raised.toLocaleString()}
                            </span>
                            <span className="text-slate-500">
                              of GH₵ {target.toLocaleString()}
                            </span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${gradientMap[theme]} rounded-full transition-all duration-700`}
                              style={{
                                width: `${Math.min(progress, 100)}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Users className="w-3.5 h-3.5" />
                            {project.contributorCount || 0} contributor
                            {project.contributorCount !== 1 ? 's' : ''}
                          </div>
                          <span className="text-xs font-semibold text-gold group-hover:gap-1.5 flex items-center gap-1 transition-all">
                            Support
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </GradientCardBody>
                  </GradientCard>
                </Link>
              );
            })}
          </div>
        )}

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
              Every Contribution Counts
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Your support builds the future
            </h2>
            <p className="text-lg text-white/90 mb-6">
              Every cedi goes directly to school development. See the impact,
              track the progress, and know exactly where your support goes.
            </p>
            <ButtonLink
              href="/register"
              variant="gradient"
              size="lg"
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Become a Contributor
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
