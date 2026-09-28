'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Logo } from '@/components/ui/Logo';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/schools', label: 'Schools' },
  { href: '/alumni', label: 'Alumni' },
  { href: '/events', label: 'Events' },
  { href: '/projects', label: 'Projects' },
  { href: '/news', label: 'News' },
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/businesses', label: 'Businesses' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();

  // Track scroll for glass effect
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  function handleLogout() {
    logout();
    setUserMenuOpen(false);
    router.push('/');
  }

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : '?';

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-border shadow-sm'
          : 'bg-surface/80 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <Logo size="md" variant="icon" href={null} />
            <div className="flex flex-col leading-none">
              <span className="font-display font-extrabold text-lg gradient-text-neon">
                PRESEC
              </span>
              <span className="text-2xs font-medium text-text-muted tracking-widest">
                GHANA
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => {
              const active =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'text-transparent bg-clip-text bg-gradient-neon'
                      : 'text-text hover:text-brand'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-neon rounded-full shadow-glow-pink" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-text-secondary hover:text-brand hover:bg-brand/10 transition-colors"
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? (
                <SunIcon />
              ) : (
                <MoonIcon />
              )}
            </button>

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-border hover:border-brand/40 hover:bg-brand/5 transition-all"
                  aria-label="User menu"
                >
                  <span className="w-8 h-8 rounded-full bg-gradient-brand text-white flex items-center justify-center text-xs font-bold">
                    {initials}
                  </span>
                  <span className="text-sm font-medium text-text">
                    {user.firstName}
                  </span>
                  <ChevronDownIcon />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-xl shadow-xl py-2 animate-slide-down overflow-hidden">
                    <div className="px-4 py-3 border-b border-border">
                      <div className="text-sm font-semibold text-text truncate">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-text-muted truncate">
                        {user.email}
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-surface-hover"
                    >
                      <DashboardIcon />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-surface-hover"
                    >
                      <UserIcon />
                      My Profile
                    </Link>
                    {(user.role === 'super_admin' ||
                      user.role === 'school_admin') && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gold-dark hover:bg-surface-hover"
                      >
                        <ShieldIcon />
                        Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10"
                      >
                        <LogoutIcon />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-brand transition-colors"
                >
                  Login
                </Link>
                <ButtonLink
                  href="/register"
                  variant="gradient"
                  size="sm"
                >
                  Join Now
                </ButtonLink>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-brand hover:bg-brand/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <nav className="lg:hidden py-4 border-t border-border animate-slide-down">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const active =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-brand/10 text-brand'
                        : 'text-text-secondary hover:bg-surface-hover'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="pt-3 mt-2 border-t border-border flex flex-col gap-2">
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-hover"
                >
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                </button>

                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="px-3 py-2.5 rounded-lg text-sm font-medium text-brand bg-brand/10"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-hover"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-error/10"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-hover"
                    >
                      Login
                    </Link>
                    <ButtonLink
                      href="/register"
                      variant="gradient"
                      size="sm"
                      fullWidth
                    >
                      Join Now
                    </ButtonLink>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

/* Icons */
function MenuIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}
