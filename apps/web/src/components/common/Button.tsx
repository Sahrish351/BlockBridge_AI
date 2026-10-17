import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bb-focus focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 rounded-lg min-h-[36px] gap-1.5',
    md: 'text-sm px-5 py-2.5 rounded-xl min-h-[44px] gap-2',
    lg: 'text-base px-6 py-3 rounded-xl min-h-[50px] gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-bb-brand text-white hover:bg-bb-brand-hover shadow-sm hover:shadow',
    secondary: 'bg-white text-bb-ink border border-bb-line hover:bg-bb-surface-soft hover:border-bb-line-strong shadow-sm',
    accent: 'bg-bb-coral text-white hover:bg-bb-coral-hover shadow-sm',
    outline: 'bg-transparent text-bb-brand border border-bb-brand hover:bg-bb-brand-soft',
    ghost: 'bg-transparent text-bb-ink-muted hover:text-bb-ink hover:bg-bb-surface-soft',
    danger: 'bg-bb-danger text-white hover:opacity-90 shadow-sm',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
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
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};
