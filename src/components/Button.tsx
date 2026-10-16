import React from 'react';
import { ButtonVariant, ButtonSize } from '../types';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isFullWidth?: boolean;
  accessibleName?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  isFullWidth = false,
  accessibleName,
  disabled,
  className = '',
  onClick,
  type = 'button',
  ...rest
}) => {
  const isDisabled = disabled || isLoading;

  // Sizing tokens ensuring minimum 44px touch targets on interactive controls
  const sizeClasses = {
    sm: 'min-h-[44px] px-4 py-2 text-[14px]',
    md: 'min-h-[48px] px-5 py-2.5 text-[15px]',
    lg: 'min-h-[52px] px-6 py-3 text-[16px]',
  }[size];

  // Variant styling according to FEMUR Design System
  const variantClasses = {
    primary:
      'bg-[#0F3F24] text-[#FFFFFF] hover:bg-[#0A2E19] active:bg-[#0A2E19] border border-[#0F3F24] shadow-none disabled:bg-[#CFDACF] disabled:border-[#CFDACF] disabled:text-[#4F6B58] disabled:cursor-not-allowed',
    secondary:
      'bg-[#FFFFFF] text-[#0F3F24] border border-[#CFDACF] hover:bg-[#EEF3EC] active:bg-[#EEF3EC] shadow-none disabled:bg-[#FDFDFB] disabled:border-[#CFDACF]/60 disabled:text-[#4F6B58]/60 disabled:cursor-not-allowed',
    text:
      'bg-transparent text-[#0F3F24] hover:text-[#0A2E19] hover:bg-[#EEF3EC]/50 border border-transparent shadow-none disabled:text-[#4F6B58]/50 disabled:cursor-not-allowed',
  }[variant];

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-label={accessibleName}
      aria-busy={isLoading}
      onClick={isDisabled ? undefined : onClick}
      className={`inline-flex items-center justify-center gap-2.5 font-medium rounded-[12px] transition-colors duration-150 select-none whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#0F3F24] focus-visible:outline-offset-2 ${sizeClasses} ${variantClasses} ${
        isFullWidth ? 'w-full' : ''
      } ${className}`}
      {...rest}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            role="status"
            aria-label="Loading"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span>{loadingText || children}</span>
        </span>
      ) : (
        <>
          {leftIcon && <span className="shrink-0" aria-hidden="true">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0" aria-hidden="true">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
