'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  ArrowLeft,
  Shield,
  Mail,
} from 'lucide-react';
import { GradientCard, GradientCardBody } from '@/components/ui/GradientCard';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

interface UsersResponse {
  items: User[];
  total: number;
  limit: number;
  offset: number;
}

function roleBadge(role: string) {
  switch (role) {
    case 'super_admin':
      return { color: 'red' as const, label: 'Super Admin' };
    case 'school_admin':
      return { color: 'gold' as const, label: 'Admin' };
    case 'teacher':
      return { color: 'purple' as const, label: 'Teacher' };
    case 'student':
      return { color: 'sky' as const, label: 'Student' };
    case 'alumni':
      return { color: 'blue' as const, label: 'Alumni' };
    default:
      return { color: 'gray' as const, label: role };
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<UsersResponse>(
          `/users?limit=100${filter ? `&role=${filter}` : ''}`,
          true,
        );
        setUsers(data.items || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error('Failed to load users', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [filter]);

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
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-gold transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="font-display text-3xl font-extrabold text-white mb-2">
          Users
        </h1>
        <p className="text-slate-400 text-sm">
          {total} {total === 1 ? 'user' : 'users'} total
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['', 'alumni', 'teacher', 'student', 'school_admin', 'super_admin'].map(
          (r) => (
            <button
              key={r || 'all'}
              onClick={() => setFilter(r)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === r
                  ? 'bg-gradient-brand text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {r ? roleBadge(r).label : 'All Users'}
            </button>
          ),
        )}
      </div>

      {users.length === 0 ? (
        <GradientCard theme="violet" hover={false}>
          <GradientCardBody className="p-12 text-center">
            <Users className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h2 className="font-display font-bold text-white text-xl mb-2">
              No users found
            </h2>
            <p className="text-slate-400">
              {filter
                ? `No users with role "${filter}"`
                : 'No users registered yet'}
            </p>
          </GradientCardBody>
        </GradientCard>
      ) : (
        <div className="space-y-3">
          {users.map((user) => {
            const badge = roleBadge(user.role);
            const initials =
              `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();

            return (
              <GradientCard key={user.id} theme="violet" hover={false}>
                <GradientCardBody className="p-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold shrink-0">
                      {initials || '?'}
                    </div>

                    <div className="flex-1 min-w-[200px]">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-white">
                          {user.firstName} {user.lastName}
                        </span>
                        <Badge color={badge.color} size="sm">
                          <Shield className="w-3 h-3" />
                          {badge.label}
                        </Badge>
                        {user.isVerified && (
                          <Badge color="green" size="sm">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-slate-400 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        {user.email}
                      </div>
                    </div>

                    <div className="text-xs text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString('en-GB')}
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
