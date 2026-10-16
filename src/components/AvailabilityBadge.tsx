import React from 'react';
import { VerificationState } from '../types';
import { IconCheck, IconClock, IconAlertTriangle } from './LineIcons';

export interface AvailabilityBadgeProps {
  state: VerificationState;
  lastConfirmedTime?: string;
  className?: string;
}

/**
 * AvailabilityBadge: Confirmed + time / Unconfirmed / Stale
 * Always paired with an icon and explicit text.
 * Never relies on color alone.
 */
export const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({
  state,
  lastConfirmedTime,
  className = '',
}) => {
  const config = {
    confirmed: {
      bg: 'bg-[#EEF3EC]',
      border: 'border-[#247447]/30',
      text: 'text-[#247447]',
      label: lastConfirmedTime ? `Confirmed: ${lastConfirmedTime}` : 'Confirmed recently',
      icon: <IconCheck size={14} strokeWidth={2} className="shrink-0 text-[#247447]" />,
    },
    stale: {
      bg: 'bg-[#FFF9EB]',
      border: 'border-[#9A6700]/30',
      text: 'text-[#9A6700]',
      label: lastConfirmedTime ? `Stale: ${lastConfirmedTime}` : 'Stale: refresh required',
      icon: <IconClock size={14} strokeWidth={2} className="shrink-0 text-[#9A6700]" />,
    },
    unconfirmed: {
      bg: 'bg-[#FEF3F2]',
      border: 'border-[#B42318]/30',
      text: 'text-[#B42318]',
      label: 'Unconfirmed today',
      icon: <IconAlertTriangle size={14} strokeWidth={2} className="shrink-0 text-[#B42318]" />,
    },
  }[state];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[14px] font-interface-sans font-medium leading-none select-none ${config.bg} ${config.border} ${config.text} ${className}`}
      role="status"
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
