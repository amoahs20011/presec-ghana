import { ReactNode } from 'react';

interface SectionProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bg?: 'white' | 'alt';
}

export function Section({
  title,
  subtitle,
  action,
  children,
  className = '',
  bg = 'white',
}: SectionProps) {
  return (
    <section
      className={`${
        bg === 'alt' ? 'bg-presec-bg-alt' : 'bg-white'
      } py-12 lg:py-16 ${className}`}
    >
      <div className="container">
        {(title || action) && (
          <div className="flex items-end justify-between mb-8">
            <div>
              {title && (
                <h2 className="text-3xl lg:text-4xl font-bold text-presec-blue">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-2 text-presec-text-muted">{subtitle}</p>
              )}
            </div>
            {action}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
