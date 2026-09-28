import { ReactNode } from 'react';

type CardVariant = 'default' | 'elevated' | 'outline' | 'gradient';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  variant?: CardVariant;
  onClick?: () => void;
}

const variantClasses: Record<CardVariant, string> = {
  default:
    'bg-white/80 backdrop-blur-md border border-white/40 shadow-sm',
  elevated:
    'bg-white/85 backdrop-blur-md border border-white/50 shadow-md hover:shadow-xl',
  outline:
    'bg-transparent border-2 border-brand/20',
  gradient:
    'bg-gradient-to-br from-white/90 to-brand/5 backdrop-blur-md border border-white/40 shadow-md',
};

export function Card({
  children,
  className = '',
  hover = false,
  variant = 'default',
  onClick,
}: CardProps) {
  const base = variantClasses[variant];
  const hoverClass = hover
    ? 'transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl cursor-pointer'
    : 'transition-shadow duration-200';
  const clickClass = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`rounded-xl overflow-hidden ${base} ${hoverClass} ${clickClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function CardHeader({
  children,
  className = '',
  action,
}: CardHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between gap-3 px-5 py-4 border-b border-border ${className}`}
    >
      <div className="font-display font-semibold text-text">
        {children}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div
      className={`px-5 py-4 border-t border-border bg-surface-alt ${className}`}
    >
      {children}
    </div>
  );
}
