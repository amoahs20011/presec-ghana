'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Users, Calendar, Award } from 'lucide-react';
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
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT: Hero / Branding */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-[#172554] text-white overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-gold/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-brand-light/20 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <img
              src="/images/presec-logo.png"
              alt="PRESEC"
              className="w-12 h-12 rounded-xl"
            />
            <div className="flex flex-col leading-none">
              <span className="font-display font-extrabold text-xl">
                PRESEC
              </span>
              <span className="text-2xs font-medium text-gold tracking-widest">
                GHANA
              </span>
            </div>
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/20 border border-gold/40 text-gold-light text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Welcome Back
          </div>

          <h1 className="font-display text-4xl font-extrabold leading-tight mb-4">
            Reconnect with your
            <br />
            <span className="gradient-text-gold">PRESEC family.</span>
          </h1>

          <p className="text-gray-300 text-base leading-relaxed mb-8">
            Sign in to access your alumni profile, connect with classmates,
            register for events, and support school projects.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-xl bg-white/5 backdrop-blur border border-white/10">
              <Users className="w-5 h-5 text-gold mb-2" />
              <div className="font-bold text-lg">500+</div>
              <div className="text-2xs text-gray-400 uppercase">
                Alumni
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 backdrop-blur border border-white/10">
              <Calendar className="w-5 h-5 text-gold mb-2" />
              <div className="font-bold text-lg">50+</div>
              <div className="text-2xs text-gray-400 uppercase">
                Events
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 backdrop-blur border border-white/10">
              <Award className="w-5 h-5 text-gold mb-2" />
              <div className="font-bold text-lg">16</div>
              <div className="text-2xs text-gray-400 uppercase">
                Regions
              </div>
            </div>
          </div>
        </div>

        {/* Footer quote */}
        <div className="relative z-10 text-sm text-gray-400 italic">
          &ldquo;In Lumine Tuo Videbimus Lumen&rdquo;
        </div>
      </div>

      {/* RIGHT: Form */}
      <div className="relative flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-slate-900">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-3">
              <img
                src="/images/presec-logo.png"
                alt="PRESEC"
                className="w-10 h-10 rounded-lg"
              />
              <div className="flex flex-col leading-none text-left">
                <span className="font-display font-extrabold text-lg text-brand">
                  PRESEC
                </span>
                <span className="text-2xs font-medium text-gold tracking-widest">
                  GHANA
                </span>
              </div>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="font-display text-3xl font-extrabold text-text mb-2">
              Welcome back
            </h2>
            <p className="text-sm text-text-muted">
              Enter your details to access your account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/30 text-error-dark text-sm flex items-start gap-3 animate-slide-down">
              <div className="w-5 h-5 rounded-full bg-error text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                !
              </div>
              <div className="flex-1">{error}</div>
            </div>
          )}

          {/* Form */}
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
                    className="text-text-muted hover:text-brand transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                  className="text-xs text-brand hover:text-brand-dark font-medium"
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

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-muted uppercase tracking-wider">
              or
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Sign up link */}
          <div className="text-center text-sm text-text-secondary">
            New to PRESEC GHANA?{' '}
            <Link
              href="/register"
              className="font-semibold text-brand hover:text-brand-dark underline decoration-2 underline-offset-2"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
