import Image from 'next/image';
import Link from 'next/link';

type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type LogoVariant = 'icon' | 'full';

interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  href?: string | null;
  showText?: boolean;
  className?: string;
}

const sizeMap: Record<LogoSize, { px: number; textClass: string; subtextClass: string }> = {
  xs: { px: 24, textClass: 'text-sm', subtextClass: 'text-[10px]' },
  sm: { px: 32, textClass: 'text-base', subtextClass: 'text-[11px]' },
  md: { px: 44, textClass: 'text-lg', subtextClass: 'text-xs' },
  lg: { px: 64, textClass: 'text-2xl', subtextClass: 'text-sm' },
  xl: { px: 96, textClass: 'text-3xl', subtextClass: 'text-base' },
};

export function Logo({
  size = 'md',
  variant = 'full',
  href = '/',
  showText = true,
  className = '',
}: LogoProps) {
  const { px, textClass, subtextClass } = sizeMap[size];

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative shrink-0" style={{ width: px, height: px }}>
        <Image
          src="/images/presec-logo.png"
          alt="PRESEC — Presbyterian Secondary School"
          fill
          sizes={`${px}px`}
          className="object-contain"
          priority
        />
      </div>

      {showText && variant !== 'icon' && (
        <div className="flex flex-col leading-tight">
          <span className={`font-bold tracking-tight text-white ${textClass}`}>
            PRESEC GHANA
          </span>
          <span className={`text-presec-gold font-medium italic ${subtextClass}`}>
            In Lumine Tuo Videbimus Lumen
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
