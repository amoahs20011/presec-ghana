interface SkeletonProps {
  className?: string;
  variant?: 'line' | 'circle' | 'rect';
  width?: string;
  height?: string;
}

export function Skeleton({
  className = '',
  variant = 'rect',
  width,
  height,
}: SkeletonProps) {
  const variantClass =
    variant === 'circle'
      ? 'rounded-full'
      : variant === 'line'
        ? 'rounded h-4'
        : 'rounded-lg';

  return (
    <div
      className={`animate-pulse bg-surface-alt ${variantClass} ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
      <Skeleton variant="line" className="w-1/3" />
      <Skeleton variant="line" className="w-full" />
      <Skeleton variant="line" className="w-2/3" />
    </div>
  );
}

export function SkeletonAvatar({ size = 40 }: { size?: number }) {
  return (
    <Skeleton
      variant="circle"
      width={`${size}px`}
      height={`${size}px`}
    />
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
