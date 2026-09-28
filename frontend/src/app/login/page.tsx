'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Unable to log in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#0F172A]">
      {/* Decorative blobs */}
      <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] bg-brand-light/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <img
              src="/images/presec-logo.png"
              alt="PRESEC"
              className="w-14 h-14 rounded-xl"
            />
            <div className="flex flex-col leading-none text-left">
              <span className="font-display font-extrabold text-2xl text-white">
                PRESEC
              </span>
              <span className="text-xs font-medium text-gold tracking-widest">
                GHANA
              </span>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-slate-800/60 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="font-display text-3xl font-extrabold text-white mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-slate-400">
              Enter your details to access your account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                !
              </div>
              <div className="flex-1">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
              autoComplete="email"
              fullWidth
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                iconRight={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-gold transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
                required
                autoComplete="current-password"
                fullWidth
              />
              <div className="flex justify-end mt-2">
                <Link
                  href="/forgot-password"
                  className="text-xs text-gold hover:text-gold-light font-medium"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              fullWidth
              loading={loading}
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-xs text-slate-500 uppercase tracking-wider">
              or
            </span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          <div className="text-center text-sm text-slate-400">
            New to PRESEC GHANA?{' '}
            <Link
              href="/register"
              className="font-semibold text-gold hover:text-gold-light underline decoration-2 underline-offset-2"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
