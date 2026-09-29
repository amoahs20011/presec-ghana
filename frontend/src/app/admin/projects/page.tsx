'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  Plus,
  ArrowLeft,
  TrendingUp,
} from 'lucide-react';
import { GradientCard, GradientCardBody } from '@/components/ui/GradientCard';
import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { api } from '@/lib/api';

interface Project {
  id: string;
  title: string;
  description: string | null;
  category: string;
  targetAmount: string;
  raisedAmount: string;
  currency: string;
  status: string;
  computedProgress?: number;
  progressPercentage?: number;
  contributorCount?: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<{ items: Project[] }>(
          '/projects?limit=100',
        );
        setProjects(data.items || []);
      } catch (err) {
        console.error('Failed to load projects', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/projects/${id}`, true);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete project.');
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400">Loading...</div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-gold transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="font-display text-3xl font-extrabold text-white">
            Projects
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'} total
          </p>
        </div>
        <ButtonLink
          href="/admin/projects/new"
          variant="gradient"
          icon={<Plus className="w-4 h-4" />}
        >
          New Project
        </ButtonLink>
      </div>

      {projects.length === 0 ? (
        <GradientCard theme="emerald" hover={false}>
          <GradientCardBody className="p-12 text-center">
            <Heart className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h2 className="font-display font-bold text-white text-xl mb-2">
              No projects yet
            </h2>
            <p className="text-slate-400 mb-6">
              Create your first fundraising project.
            </p>
            <ButtonLink href="/admin/projects/new" variant="gradient">
              Create Project
            </ButtonLink>
          </GradientCardBody>
        </GradientCard>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => {
            const raised = Number(project.raisedAmount || 0);
            const target = Number(project.targetAmount || 1);
            const progress =
              project.computedProgress ??
              project.progressPercentage ??
              Math.round((raised / target) * 100);

            return (
              <GradientCard key={project.id} theme="emerald" hover={false}>
                <GradientCardBody className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-[250px]">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge color="emerald" size="sm">
                          {project.category}
                        </Badge>
                        <Badge
                          color={project.status === 'completed' ? 'green' : 'blue'}
                          size="sm"
                        >
                          {project.status}
                        </Badge>
                        <Badge color="gold" size="sm">
                          <TrendingUp className="w-3 h-3" />
                          {progress}% funded
                        </Badge>
                      </div>
                      <h3 className="font-display font-bold text-white text-lg mb-2">
                        {project.title}
                      </h3>
                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-400 mb-3">
                        <span>
                          GH₵ {raised.toLocaleString()} raised
                        </span>
                        <span>
                          of GH₵ {target.toLocaleString()}
                        </span>
                        <span>
                          {project.contributorCount || 0} contributors
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden max-w-md">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-full"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <ButtonLink
                        href={`/admin/projects/${project.id}/edit`}
                        variant="outline"
                        size="sm"
                      >
                        Edit
                      </ButtonLink>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(project.id, project.title)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </GradientCardBody>
              </GradientCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
