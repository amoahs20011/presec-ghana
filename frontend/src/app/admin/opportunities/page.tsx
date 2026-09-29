'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Plus,
  ArrowLeft,
  MapPin,
  Building2,
  Calendar,
} from 'lucide-react';
import { GradientCard, GradientCardBody } from '@/components/ui/GradientCard';
import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { api } from '@/lib/api';

interface Opportunity {
  id: string;
  type: string;
  title: string;
  companyName: string | null;
  location: string | null;
  deadline: string | null;
}

export default function AdminOpportunitiesPage() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<{ items: Opportunity[] }>(
          '/opportunities?limit=100',
        );
        setItems(data.items || []);
      } catch (err) {
        console.error('Failed to load opportunities', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await api.delete(`/opportunities/${id}`, true);
      setItems((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete.');
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
            Opportunities
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {items.length} {items.length === 1 ? 'item' : 'items'} total
          </p>
        </div>
        <ButtonLink
          href="/admin/opportunities/new"
          variant="gradient"
          icon={<Plus className="w-4 h-4" />}
        >
          New Opportunity
        </ButtonLink>
      </div>

      {items.length === 0 ? (
        <GradientCard theme="cyan" hover={false}>
          <GradientCardBody className="p-12 text-center">
            <Briefcase className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h2 className="font-display font-bold text-white text-xl mb-2">
              No opportunities yet
            </h2>
            <p className="text-slate-400 mb-6">
              Post a job, internship, or scholarship.
            </p>
            <ButtonLink href="/admin/opportunities/new" variant="gradient">
              Create Opportunity
            </ButtonLink>
          </GradientCardBody>
        </GradientCard>
      ) : (
        <div className="space-y-3">
          {items.map((opp) => (
            <GradientCard key={opp.id} theme="cyan" hover={false}>
              <GradientCardBody className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-[250px]">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge color="sky" size="sm">
                        {opp.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <h3 className="font-display font-bold text-white text-lg mb-2">
                      {opp.title}
                    </h3>
                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-400">
                      {opp.companyName && (
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          {opp.companyName}
                        </span>
                      )}
                      {opp.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {opp.location}
                        </span>
                      )}
                      {opp.deadline && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          Deadline:{' '}
                          {new Date(opp.deadline).toLocaleDateString('en-GB')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <ButtonLink
                      href={`/admin/opportunities/${opp.id}/edit`}
                      variant="outline"
                      size="sm"
                    >
                      Edit
                    </ButtonLink>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(opp.id, opp.title)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </GradientCardBody>
            </GradientCard>
          ))}
        </div>
      )}
    </div>
  );
}
