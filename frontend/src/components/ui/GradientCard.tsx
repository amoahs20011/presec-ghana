import { ReactNode } from 'react';
import Link from 'next/link';

type GradientTheme =
  | 'violet'   // violet → pink → amber
  | 'cyan'     // cyan → blue → violet
  | 'gold'     // amber → orange → red
  | 'emerald'  // emerald → cyan → blue
  | 'sunset'   // orange → pink → violet
  | 'ocean';   // blue → cyan → emerald

interface GradientCardProps {
  children: ReactNode;
  href?: string;
  className?: string;
  theme?: GradientTheme;
  hover?: boolean;
  onClick?: () => void;
}

const gradientMap: Record<GradientTheme, string> = {
  violet:
    'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%)',
  cyan:
    'linear-gradient(135deg, #06B6D4 0%, #3B82F6 50%, #8B5CF6 100%)',
  gold:
    'linear-gradient(135deg, #F59E0B 0%, #EF4444 50%, #EC4899 100%)',
  emerald:
    'linear-gradient(135deg, #10B981 0%, #06B6D4 50%, #3B82F6 100%)',
  sunset:
    'linear-gradient(135deg, #F97316 0%, #EC4899 50%, #8B5CF6 100%)',
  ocean:
    'linear-gradient(135deg, #3B82F6 0%, #06B6D4 50%, #10B981 100%)',
};

export function GradientCard({
  children,
  href,
  className = '',
  theme = 'violet',
  hover = true,
  onClick,
}: GradientCardProps) {
  const gradient = gradientMap[theme];

  const inner = (
    <div
      className={`
        relative rounded-2xl p-[1.5px] overflow-hidden
        transition-all duration-300 ease-out
        ${hover ? 'hover:-translate-y-1' : ''}
        ${className}
      `}
      style={{ background: gradient }}
    >
      <div
        className={`
          relative rounded-2xl bg-slate-900/95 backdrop-blur-sm
          h-full w-full
          ${hover ? 'group-hover:bg-slate-900' : ''}
        `}
      >
        {children}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block h-full group"
        onClick={onClick}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div className="h-full group" onClick={onClick}>
      {inner}
    </div>
  );
}

interface GradientCardBodyProps {
  children: ReactNode;
  className?: string;
}

export function GradientCardBody({
  children,
  className = '',
}: GradientCardBodyProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

interface GradientIconProps {
  children: ReactNode;
  theme?: GradientTheme;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const iconGradients: Record<GradientTheme, string> = {
  violet: 'from-violet-500 to-pink-500',
  cyan: 'from-cyan-500 to-blue-500',
  gold: 'from-amber-500 to-orange-500',
  emerald: 'from-emerald-500 to-cyan-500',
  sunset: 'from-orange-500 to-pink-500',
  ocean: 'from-blue-500 to-emerald-500',
};

const iconSizes = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-16 h-16',
};

export function GradientIcon({
  children,
  theme = 'violet',
  size = 'md',
  className = '',
}: GradientIconProps) {
  return (
    <div
      className={`
        ${iconSizes[size]}
        rounded-2xl bg-gradient-to-br ${iconGradients[theme]}
        flex items-center justify-center text-white
        shadow-lg group-hover:scale-110 group-hover:shadow-xl
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}
