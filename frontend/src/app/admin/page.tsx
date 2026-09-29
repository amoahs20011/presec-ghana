'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Calendar,
  Heart,
  Newspaper,
  Briefcase,
  Store,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { GradientCard, GradientCardBody, GradientIcon } from '@/components/ui/GradientCard';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';

interface AdminStats {
  users: number;
  events: number;
  projects: number;
  announcements: number;
  opportunities: number;
  businesses: number;
  pendingAlumni: number;
}

interface PendingAlumni {
  id: string;
  graduationYear: number | null;
  programme: string | null;
  user?: { firstName: string; lastName: string; email: string };
  school?: { name: string };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pending, setPending] = useState<PendingAlumni[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsData, pendingData] = await Promise.all([
          api.get<AdminStats>('/admin/stats', true),
          api.get<PendingAlumni[]>('/admin/pending-alumni', true),
        ]);
        setStats(statsData);
        setPending(Array.isArray(pendingData) ? pendingData : []);
      } catch (err) {
        console.error('Failed to load admin data', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400">Loading...</div>
    );
  }

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.users ?? 0,
      icon: <Users className="w-6 h-6" />,
      theme: 'violet' as const,
      href: '/admin/users',
    },
    {
      label: 'Events',
      value: stats?.events ?? 0,
      icon: <Calendar className="w-6 h-6" />,
      theme: 'cyan' as const,
      href: '/admin/events',
    },
    {
      label: 'Projects',
      value: stats?.projects ?? 0,
      icon: <Heart className="w-6 h-6" />,
      theme: 'emerald' as const,
      href: '/admin/projects',
    },
    {
      label: 'News',
      value: stats?.announcements ?? 0,
      icon: <Newspaper className="w-6 h-6" />,
      theme: 'gold' as const,
      href: '/admin/news',
    },
    {
      label: 'Opportunities',
      value: stats?.opportunities ?? 0,
      icon: <Briefcase className="w-6 h-6" />,
      theme: 'sunset' as const,
      href: '/admin/opportunities',
    },
    {
      label: 'Businesses',
      value: stats?.businesses ?? 0,
      icon: <Store className="w-6 h-6" />,
      theme: 'ocean' as const,
      href: '/businesses',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-slate-400">
          Manage PRESEC GHANA content and community
        </p>
      </div>

      {/* Pending alumni alert */}
      {stats && stats.pendingAlumni > 0 && (
        <Link href="/admin/alumni" className="block mb-8 group">
          <GradientCard theme="gold">
            <GradientCardBody className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <GradientIcon theme="gold" size="md">
                    <AlertCircle className="w-6 h-6" />
                  </GradientIcon>
                  <div>
                    <div className="font-display font-bold text-white text-lg">
                      {stats.pendingAlumni} alumni pending verification
                    </div>
                    <div className="text-sm text-slate-400">
                      Review and approve their profiles
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gold group-hover:translate-x-1 transition-transform" />
              </div>
            </GradientCardBody>
          </GradientCard>
        </Link>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className="block group">
            <GradientCard theme={card.theme} className="h-full">
              <GradientCardBody className="p-5 text-center">
                <div className="flex justify-center mb-3">
                  <GradientIcon theme={card.theme} size="md">
                    {card.icon}
                  </GradientIcon>
                </div>
                <div className="font-display text-3xl font-extrabold text-white mb-1">
                  {card.value}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  {card.label}
                </div>
              </GradientCardBody>
            </GradientCard>
          </Link>
        ))}
      </div>

      {/* Pending alumni preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-white text-xl flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gold" />
            Pending Verifications
          </h2>
          <Link
            href="/admin/alumni"
            className="text-sm font-semibold text-gold hover:text-gold-light"
          >
            View all →
          </Link>
        </div>

        {pending.length === 0 ? (
          <GradientCard theme="emerald" hover={false}>
            <GradientCardBody className="p-6 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <div className="text-white font-semibold">
                All caught up!
              </div>
              <div className="text-sm text-slate-400">
                No pending alumni verifications
              </div>
            </GradientCardBody>
          </GradientCard>
        ) : (
          <div className="space-y-3">
            {pending.slice(0, 5).map((person) => (
              <GradientCard key={person.id} theme="gold" hover={false}>
                <GradientCardBody className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                        {(person.user?.firstName?.[0] || '?')}
                        {(person.user?.lastName?.[0] || '?')}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">
                          {person.user?.firstName} {person.user?.lastName}
                        </div>
                        <div className="text-xs text-slate-400">
                          {person.graduationYear
                            ? `Class of ${person.graduationYear}`
                            : 'No year provided'}
                          {person.programme && ` • ${person.programme}`}
                        </div>
                      </div>
                    </div>
                    <Badge color="yellow" size="sm">
                      Pending
                    </Badge>
                  </div>
                </GradientCardBody>
              </GradientCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
