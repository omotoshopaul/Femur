import React from 'react';
import { Button } from './Button';
import { IconAlertTriangle, IconClock, IconRefresh, IconSearch } from './LineIcons';

export interface StateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

/** Loading State */
export const LoadingState: React.FC<{ message?: string; className?: string }> = ({
  message = 'Verifying operational status...',
  className = '',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`p-10 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] flex flex-col items-center justify-center text-center space-y-3 ${className}`}
    >
      <div className="w-8 h-8 rounded-full border-2 border-[#0F3F24] border-t-transparent animate-spin" />
      <div className="font-interface-sans text-[15px] font-medium text-[#0F3F24]">
        {message}
      </div>
      <p className="font-interface-sans text-[14px] text-[#4F6B58] max-w-sm">
        Polling direct facility logs and accredited response readiness.
      </p>
    </div>
  );
};

/** Error State */
export const ErrorState: React.FC<StateProps> = ({
  title = 'Unable to confirm facility status',
  description = 'Direct communication with the facility dispatch system timed out. You may attempt to reconnect or call direct emergency lines.',
  actionText = 'Retry Verification',
  onAction,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`p-8 border border-[#B42318]/40 rounded-[12px] bg-[#FEF3F2]/60 flex flex-col items-center justify-center text-center space-y-3.5 ${className}`}
    >
      <div className="w-12 h-12 rounded-[12px] bg-[#FEF3F2] border border-[#B42318]/30 flex items-center justify-center text-[#B42318]">
        <IconAlertTriangle size={24} strokeWidth={1.5} />
      </div>
      <div className="space-y-1 max-w-md">
        <h4 className="font-interface-sans text-[17px] font-semibold text-[#B42318]">
          {title}
        </h4>
        <p className="font-interface-sans text-[14px] text-[#0F3F24] leading-relaxed">
          {description}
        </p>
      </div>
      {onAction && (
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<IconRefresh size={16} strokeWidth={1.5} />}
          onClick={onAction}
          className="bg-[#FFFFFF]"
          accessibleName={actionText}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};

/** Offline State */
export const OfflineState: React.FC<StateProps> = ({
  title = 'Operating in offline cache mode',
  description = 'Network connectivity is degraded. Cached facility records are displayed with previous confirmation timestamps. For immediate life-saving assistance, call 112 directly.',
  actionText = 'Check Connection',
  onAction,
  className = '',
}) => {
  return (
    <div
      role="status"
      className={`p-8 border border-[#9A6700]/40 rounded-[12px] bg-[#FFF9EB]/70 flex flex-col items-center justify-center text-center space-y-3.5 ${className}`}
    >
      <div className="w-12 h-12 rounded-[12px] bg-[#FFF9EB] border border-[#9A6700]/30 flex items-center justify-center text-[#9A6700]">
        <IconClock size={24} strokeWidth={1.5} />
      </div>
      <div className="space-y-1 max-w-md">
        <h4 className="font-interface-sans text-[17px] font-semibold text-[#9A6700]">
          {title}
        </h4>
        <p className="font-interface-sans text-[14px] text-[#0F3F24] leading-relaxed">
          {description}
        </p>
      </div>
      {onAction && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onAction}
          className="bg-[#FFFFFF]"
          accessibleName={actionText}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};

/** Empty State */
export const EmptyState: React.FC<StateProps> = ({
  title = 'No matching verified facilities found',
  description = 'Try broadening your search radius or selecting a different clinical capability category.',
  actionText = 'Reset Filters',
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`p-10 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] flex flex-col items-center justify-center text-center space-y-3.5 ${className}`}
    >
      <div className="w-12 h-12 rounded-[12px] bg-[#EEF3EC] border border-[#CFDACF] flex items-center justify-center text-[#0F3F24]">
        <IconSearch size={22} strokeWidth={1.5} />
      </div>
      <div className="space-y-1 max-w-md">
        <h4 className="font-interface-sans text-[17px] font-medium text-[#0F3F24]">
          {title}
        </h4>
        <p className="font-interface-sans text-[14px] text-[#4F6B58] leading-relaxed">
          {description}
        </p>
      </div>
      {onAction && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onAction}
          accessibleName={actionText}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};
