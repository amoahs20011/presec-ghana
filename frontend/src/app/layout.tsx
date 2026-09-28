import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BackToTop } from '@/components/layout/BackToTop';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: {
    default: 'PRESEC GHANA — Connecting the Past, Present & Future',
    template: '%s | PRESEC GHANA',
  },
  description:
    'Digital home for Presbyterian Secondary School alumni, students, and staff across Ghana. Reconnect, mentor, and give back.',
  icons: {
    icon: '/favicon.png',
    apple: '/images/presec-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-surface-alt text-text antialiased font-sans">
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <BackToTop />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
