import React from 'react';

export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export interface StatusBadgeProps {
  label: string;
  tone?: StatusTone;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * StatusBadge: Operational status pill paired with icon or text
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  tone = 'neutral',
  icon,
  className = '',
}) => {
  const toneClasses = {
    neutral: 'bg-[#EEF3EC] text-[#0F3F24] border-[#CFDACF]',
    success: 'bg-[#EEF3EC] text-[#247447] border-[#247447]/30',
    warning: 'bg-[#FFF9EB] text-[#9A6700] border-[#9A6700]/30',
    danger: 'bg-[#FEF3F2] text-[#B42318] border-[#B42318]/30',
    info: 'bg-[#EFF8FF] text-[#245B91] border-[#245B91]/30',
  }[tone];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[14px] font-interface-sans font-medium leading-none select-none ${toneClasses} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
    </span>
  );
};
