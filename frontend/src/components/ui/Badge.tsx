import { ReactNode } from 'react';

type BadgeColor =
  | 'blue'
  | 'gold'
  | 'green'
  | 'red'
  | 'yellow'
  | 'gray'
  | 'gray-dark'
  | 'sky'
  | 'purple';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: ReactNode;
  color?: BadgeColor;
  size?: BadgeSize;
  className?: string;
  dot?: boolean;
}

const colorClasses: Record<BadgeColor, string> = {
  blue: 'bg-brand/10 text-brand border-brand/20',
  gold: 'bg-gold/10 text-gold-dark border-gold/20',
  green: 'bg-success/10 text-success-dark border-success/20',
  red: 'bg-error/10 text-error-dark border-error/20',
  yellow: 'bg-warning/10 text-warning-dark border-warning/20',
  gray: 'bg-surface-alt text-text-secondary border-border',
  sky: 'bg-info/10 text-info-dark border-info/20',
  purple: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
  'gray-dark': 'bg-slate-200 text-slate-800 border-slate-300',
};

const dotColorClasses: Record<BadgeColor, string> = {
  blue: 'bg-brand',
  gold: 'bg-gold',
  green: 'bg-success',
  red: 'bg-error',
  yellow: 'bg-warning',
  gray: 'bg-text-muted',
  sky: 'bg-info',
  purple: 'bg-purple-500',
  'gray-dark': 'bg-slate-500',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-2xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export function Badge({
  children,
  color = 'blue',
  size = 'md',
  className = '',
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${colorClasses[color]} ${sizeClasses[size]} ${className}`}
    >
      {dot && (
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full ${dotColorClasses[color]}`}
        />
      )}
      {children}
    </span>
  );
}
