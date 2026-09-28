import Link from 'next/link';
import { ReactNode, forwardRef } from 'react';

type Variant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'gradient';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand text-white hover:bg-brand-dark active:bg-brand-dark shadow-sm hover:shadow-md focus-visible:ring-brand',
  secondary:
    'bg-gold text-white hover:bg-gold-dark active:bg-gold-dark shadow-sm hover:shadow-md focus-visible:ring-gold',
  outline:
    'border-2 border-brand text-brand bg-transparent hover:bg-brand hover:text-white focus-visible:ring-brand',
  ghost:
    'text-brand bg-transparent hover:bg-brand/10 focus-visible:ring-brand',
  danger:
    'bg-error text-white hover:bg-error-dark active:bg-error-dark shadow-sm hover:shadow-md focus-visible:ring-error',
  gradient:
    'bg-gradient-brand text-white shadow-md hover:shadow-xl hover:brightness-110 focus-visible:ring-brand',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-lg gap-2',
  lg: 'px-7 py-3 text-base rounded-lg gap-2',
  xl: 'px-9 py-4 text-lg rounded-xl gap-3',
};

function cx(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

function classes(
  variant: Variant,
  size: Size,
  className?: string,
  fullWidth?: boolean,
) {
  return cx(
    'inline-flex items-center justify-center font-semibold',
    'transition-all duration-200 ease-out',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
    'transform hover:-translate-y-0.5 active:translate-y-0',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className,
  );
}

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    BaseProps {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      className,
      children,
      loading,
      icon,
      iconRight,
      fullWidth,
      disabled,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={classes(variant, size, className, fullWidth)}
        disabled={disabled || loading}
        {...rest}
      >
        {loading ? (
          <>
            <Spinner />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && <span className="inline-flex">{icon}</span>}
            {children}
            {iconRight && <span className="inline-flex">{iconRight}</span>}
          </>
        )}
      </button>
    );
  },
);
Button.displayName = 'Button';

interface ButtonLinkProps extends BaseProps {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  icon,
  iconRight,
  fullWidth,
  target,
  rel,
  onClick,
}: ButtonLinkProps) {
  const isExternal = href.startsWith('http');
  const Comp: any = isExternal ? 'a' : Link;

  return (
    <Comp
      href={href}
      target={target}
      rel={rel || (isExternal ? 'noopener noreferrer' : undefined)}
      onClick={onClick}
      className={classes(variant, size, className, fullWidth)}
    >
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
      {iconRight && <span className="inline-flex">{iconRight}</span>}
    </Comp>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
