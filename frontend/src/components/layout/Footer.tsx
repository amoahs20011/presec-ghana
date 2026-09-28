'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Logo } from '@/components/ui/Logo';

const columns = [
  {
    title: 'Explore',
    links: [
      { href: '/about', label: 'About' },
      { href: '/schools', label: 'Schools' },
      { href: '/heritage', label: 'Heritage' },
      { href: '/news', label: 'News' },
    ],
  },
  {
    title: 'Community',
    links: [
      { href: '/alumni', label: 'Alumni Directory' },
      { href: '/events', label: 'Events' },
      { href: '/mentorship', label: 'Mentorship' },
      { href: '/businesses', label: 'Businesses' },
    ],
  },
  {
    title: 'Opportunities',
    links: [
      { href: '/opportunities', label: 'Jobs & Careers' },
      { href: '/projects', label: 'Support Projects' },
      { href: '/gallery', label: 'Gallery' },
      { href: '/contact', label: 'Contact Us' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/terms', label: 'Terms of Service' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/cookies', label: 'Cookie Policy' },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  }

  return (
    <footer className="bg-gradient-navy text-white mt-auto relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-light/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container relative py-14">
        {/* NEWSLETTER BAR */}
        <div className="mb-12 p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="font-display font-bold text-xl mb-1">
              Stay connected
            </h3>
            <p className="text-sm text-gray-300">
              Get updates on reunions, events, projects, and alumni stories.
            </p>
          </div>
          <form
            onSubmit={handleSubscribe}
            className="flex w-full md:w-auto gap-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold w-full md:w-72"
              required
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-gradient-gold text-brand-dark font-semibold text-sm hover:brightness-110 transition-all whitespace-nowrap"
            >
              {subscribed ? '✓ Subscribed' : 'Subscribe'}
            </button>
          </form>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* BRAND COLUMN */}
          <div className="col-span-2">
            <Link
              href="/"
              className="flex items-center gap-3 mb-5 group"
            >
              <Logo size="md" variant="icon" href={null} />
              <div className="flex flex-col leading-none">
                <span className="font-display font-bold text-lg text-white">
                  PRESEC
                </span>
                <span className="text-2xs font-medium text-gold tracking-widest">
                  GHANA
                </span>
              </div>
            </Link>

            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              The digital home of Presbyterian Secondary School alumni,
              students, and staff across Ghana&apos;s 16 regions.
            </p>

            <p className="text-sm font-medium italic text-gold mb-6">
              &ldquo;In Lumine Tuo Videbimus Lumen&rdquo;
            </p>

            {/* SOCIAL */}
            <div className="flex items-center gap-3">
              <SocialLink href="https://facebook.com" label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </SocialLink>
              <SocialLink href="https://twitter.com" label="X / Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialLink>
              <SocialLink href="https://linkedin.com" label="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </SocialLink>
              <SocialLink href="https://youtube.com" label="YouTube">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </SocialLink>
            </div>
          </div>

          {/* LINK COLUMNS */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-semibold text-gold text-sm uppercase tracking-wider mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-300 hover:text-gold transition-colors inline-flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-gold transition-all duration-200 mr-0 group-hover:mr-2" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} PRESEC GHANA. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            Made with
            <span className="text-error">♥</span>
            in Ghana
            <span className="text-lg leading-none">🇬🇭</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-gold hover:text-brand-dark hover:border-gold transition-all duration-200"
    >
      {children}
    </a>
  );
}
