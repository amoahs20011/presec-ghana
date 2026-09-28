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
    'bg-slate-900/80 backdrop-blur-md border border-slate-700 shadow-sm',
  elevated:
    'bg-slate-900/85 backdrop-blur-md border border-slate-700 shadow-md hover:shadow-xl hover:border-slate-600',
  outline:
    'bg-transparent border-2 border-slate-700',
  gradient:
    'bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-md border border-slate-700 shadow-md',
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
      className={`flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-700 ${className}`}
    >
      <div className="font-display font-semibold text-white">
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
      className={`px-5 py-4 border-t border-slate-700 bg-slate-800/50 ${className}`}
    >
      {children}
    </div>
  );
}
