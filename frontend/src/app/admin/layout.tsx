'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Heart,
  Newspaper,
  Briefcase,
  CheckCircle2,
  ArrowLeft,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/alumni', label: 'Verify Alumni', icon: CheckCircle2 },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/projects', label: 'Projects', icon: Heart },
  { href: '/admin/news', label: 'News', icon: Newspaper },
  { href: '/admin/opportunities', label: 'Opportunities', icon: Briefcase },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || authLoading) return;
    if (!user) {
      router.replace('/login?redirect=/admin');
      return;
    }
    const isAdmin =
      user.role === 'super_admin' || user.role === 'school_admin';
    if (!isAdmin) {
      router.replace('/dashboard');
    }
  }, [user, authLoading, mounted, router]);

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const isAdmin =
    user.role === 'super_admin' || user.role === 'school_admin';
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-slate-900/50 border-r border-slate-800 sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-white text-sm">
                Admin Panel
              </div>
              <div className="text-xs text-slate-500">PRESEC GHANA</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-violet-500/20 to-pink-500/20 text-white border border-violet-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="container py-8 max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
