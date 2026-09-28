'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 bg-presec-bg-alt">
      <div className="container max-w-md">
        <Card>
          <CardBody>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-presec-gold rounded-full mx-auto flex items-center justify-center font-bold text-presec-blue-dark text-xl">
                P
              </div>
              <h1 className="mt-4 text-2xl font-bold text-presec-blue">
                Welcome Back
              </h1>
              <p className="mt-1 text-sm text-presec-text-muted">
                Login to your PRESEC GHANA account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />

              {error && (
                <div className="bg-red-50 border border-red-200 text-presec-error px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-presec-text-muted">
                Don&apos;t have an account?{' '}
              </span>
              <Link
                href="/register"
                className="font-semibold text-presec-blue hover:underline"
              >
                Register here
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
