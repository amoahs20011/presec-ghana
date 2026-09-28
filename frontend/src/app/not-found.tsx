import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-20">
      <div className="container text-center max-w-lg">
        <div className="text-8xl font-bold text-presec-gold">404</div>
        <h1 className="mt-6 text-3xl font-bold text-presec-blue">
          Page Not Found
        </h1>
        <p className="mt-3 text-presec-text-muted">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
          It may have been moved or removed.
        </p>
        <div className="mt-8 flex justify-center gap-3 flex-wrap">
          <ButtonLink href="/" variant="primary">
            Go Home
          </ButtonLink>
          <ButtonLink href="/alumni" variant="outline">
            Explore Alumni
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

