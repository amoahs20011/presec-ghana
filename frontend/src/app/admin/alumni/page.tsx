'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  GraduationCap,
  MapPin,
  Briefcase,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { GradientCard, GradientCardBody, GradientIcon } from '@/components/ui/GradientCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';

interface PendingAlumni {
  id: string;
  graduationYear: number | null;
  programme: string | null;
  currentProfession: string | null;
  locationCity: string | null;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  school?: { name: string };
}

export default function AdminAlumniPage() {
  const [pending, setPending] = useState<PendingAlumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await api.get<PendingAlumni[]>(
        '/admin/pending-alumni',
        true,
      );
      setPending(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load pending alumni', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleVerify(id: string, approved: boolean) {
    setActionId(id);
    try {
      await api.patch(
        `/alumni/${id}/verify`,
        { status: approved ? 'verified' : 'rejected' },
        true,
      );
      setPending((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Verify failed', err);
      alert('Failed to verify. Please try again.');
    } finally {
      setActionId(null);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400">Loading...</div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-gold transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="font-display text-3xl font-extrabold text-white mb-2">
          Verify Alumni
        </h1>
        <p className="text-slate-400">
          Review pending alumni profiles and approve genuine registrations.
        </p>
      </div>

      {pending.length === 0 ? (
        <GradientCard theme="emerald" hover={false}>
          <GradientCardBody className="p-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="font-display font-bold text-white text-xl mb-2">
              All caught up!
            </h2>
            <p className="text-slate-400">
              No pending alumni verifications.
            </p>
          </GradientCardBody>
        </GradientCard>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <AlertCircle className="w-4 h-4 text-gold" />
            {pending.length} pending {pending.length === 1 ? 'request' : 'requests'}
          </div>

          {pending.map((person) => {
            const isProcessing = actionId === person.id;
            const initials =
              `${person.user?.firstName?.[0] || ''}${
                person.user?.lastName?.[0] || ''
              }`.toUpperCase();

            return (
              <GradientCard key={person.id} theme="gold" hover={false}>
                <GradientCardBody className="p-6">
                  <div className="flex flex-wrap items-start gap-4 mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xl font-bold shrink-0">
                      {initials || '?'}
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <h3 className="font-display font-bold text-lg text-white mb-1">
                        {person.user?.firstName} {person.user?.lastName}
                      </h3>
                      <div className="text-sm text-slate-400 mb-3">
                        {person.user?.email}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {person.graduationYear && (
                          <Badge color="blue" size="sm">
                            <GraduationCap className="w-3 h-3" />
                            Class of {person.graduationYear}
                          </Badge>
                        )}
                        {person.programme && (
                          <Badge color="gold" size="sm">
                            {person.programme}
                          </Badge>
                        )}
                        {person.locationCity && (
                          <Badge color="sky" size="sm">
                            <MapPin className="w-3 h-3" />
                            {person.locationCity}
                          </Badge>
                        )}
                        <Badge color="yellow" size="sm">
                          Pending Verification
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {(person.currentProfession || person.school?.name) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                      {person.currentProfession && (
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Briefcase className="w-4 h-4 text-slate-500" />
                          {person.currentProfession}
                        </div>
                      )}
                      {person.school?.name && (
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <GraduationCap className="w-4 h-4 text-slate-500" />
                          {person.school.name}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="gradient"
                      size="md"
                      onClick={() => handleVerify(person.id, true)}
                      disabled={isProcessing}
                      icon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      {isProcessing ? 'Processing...' : 'Approve'}
                    </Button>
                    <Button
                      variant="danger"
                      size="md"
                      onClick={() => handleVerify(person.id, false)}
                      disabled={isProcessing}
                      icon={<XCircle className="w-4 h-4" />}
                    >
                      Reject
                    </Button>
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
