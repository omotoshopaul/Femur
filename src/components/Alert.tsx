import React from 'react';
import { AlertSeverity } from '../types';
import { IconAlertTriangle, IconCheck, IconX } from './LineIcons';

export interface AlertProps {
  severity?: AlertSeverity;
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  severity = 'info',
  title,
  children,
  onDismiss,
  action,
  className = '',
}) => {
  const config = {
    danger: {
      bg: 'bg-[#FEF3F2]',
      border: 'border-[#B42318]/40',
      text: 'text-[#B42318]',
      bodyText: 'text-[#0F3F24]',
      icon: <IconAlertTriangle size={20} strokeWidth={2} className="shrink-0 text-[#B42318]" />,
    },
    warning: {
      bg: 'bg-[#FFF9EB]',
      border: 'border-[#9A6700]/40',
      text: 'text-[#9A6700]',
      bodyText: 'text-[#0F3F24]',
      icon: <IconAlertTriangle size={20} strokeWidth={2} className="shrink-0 text-[#9A6700]" />,
    },
    info: {
      bg: 'bg-[#EFF8FF]',
      border: 'border-[#245B91]/40',
      text: 'text-[#245B91]',
      bodyText: 'text-[#0F3F24]',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="shrink-0 text-[#245B91]"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
    },
    success: {
      bg: 'bg-[#EEF3EC]',
      border: 'border-[#247447]/40',
      text: 'text-[#247447]',
      bodyText: 'text-[#0F3F24]',
      icon: <IconCheck size={20} strokeWidth={2} className="shrink-0 text-[#247447]" />,
    },
  }[severity];

  return (
    <div
      role="alert"
      className={`rounded-[12px] p-4 border ${config.bg} ${config.border} flex items-start gap-3.5 ${className}`}
    >
      <div className="mt-0.5" aria-hidden="true">
        {config.icon}
      </div>
      <div className="flex-1 space-y-1">
        {title && (
          <h4 className={`font-interface-sans text-[15px] font-semibold ${config.text}`}>
            {title}
          </h4>
        )}
        <div className={`font-interface-sans text-[14px] leading-relaxed ${config.bodyText}`}>
          {children}
        </div>
        {action && <div className="pt-2">{action}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="text-[#4F6B58] hover:text-[#0F3F24] p-1 rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
        >
          <IconX size={16} />
        </button>
      )}
    </div>
  );
};
