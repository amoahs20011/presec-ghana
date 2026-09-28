import { forwardRef, ReactNode } from 'react';

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  fullWidth?: boolean;
}

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  fullWidth?: boolean;
  children: ReactNode;
}

const baseInputClasses =
  'w-full bg-surface border rounded-lg px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand disabled:opacity-60 disabled:cursor-not-allowed';

function cx(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      icon,
      iconRight,
      fullWidth,
      className,
      id,
      ...rest
    },
    ref,
  ) => {
    const inputId = id || rest.name;
    const borderClass = error
      ? 'border-error focus:border-error focus:ring-error/30'
      : 'border-border';

    return (
      <div className={cx(fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cx(
              baseInputClasses,
              borderClass,
              icon && 'pl-10',
              iconRight && 'pr-10',
              className,
            )}
            {...rest}
          />
          {iconRight && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              {iconRight}
            </div>
          )}
        </div>
        {hint && !error && (
          <p className="mt-1.5 text-xs text-text-muted">{hint}</p>
        )}
        {error && (
          <p className="mt-1.5 text-xs text-error">{error}</p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, hint, error, fullWidth, className, id, ...rest },
    ref,
  ) => {
    const inputId = id || rest.name;
    const borderClass = error
      ? 'border-error focus:border-error focus:ring-error/30'
      : 'border-border';

    return (
      <div className={cx(fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cx(
            baseInputClasses,
            borderClass,
            'min-h-[100px] resize-y',
            className,
          )}
          {...rest}
        />
        {hint && !error && (
          <p className="mt-1.5 text-xs text-text-muted">{hint}</p>
        )}
        {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, fullWidth, className, id, children, ...rest }, ref) => {
    const inputId = id || rest.name;
    const borderClass = error
      ? 'border-error focus:border-error focus:ring-error/30'
      : 'border-border';

    return (
      <div className={cx(fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text mb-1.5"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cx(
            baseInputClasses,
            borderClass,
            'appearance-none bg-no-repeat pr-9',
            className,
          )}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='none' stroke='%2394A3B8' stroke-width='1.5' d='M3 4.5L6 7.5L9 4.5'/%3E%3C/svg%3E\")",
            backgroundPosition: 'right 0.75rem center',
          }}
          {...rest}
        >
          {children}
        </select>
        {hint && !error && (
          <p className="mt-1.5 text-xs text-text-muted">{hint}</p>
        )}
        {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
      </div>
    );
  },
);
Select.displayName = 'Select';
