import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
  strokeWidth?: number;
  title?: string;
}

const defaultProps = {
  size: 20,
  strokeWidth: 1.5,
  fill: 'none',
  stroke: 'currentColor',
};

/** Nested Squares: Signature FEMUR line icon representing coordination & verification modules */
export const IconNestedSquares: React.FC<IconProps> = ({
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  title = 'Modular Coordination',
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label={title}
    {...rest}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <rect x="7" y="7" width="10" height="10" rx="1.5" />
    <path d="M12 7v10" />
    <path d="M7 12h10" />
  </svg>
);

/** Distinct Service Icon 1: Locate - Geometric crosshair grid */
export const IconServiceLocate: React.FC<IconProps> = ({
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  title = 'Locate Care',
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label={title}
    {...rest}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3v4" />
    <path d="M12 17v4" />
    <path d="M3 12h4" />
    <path d="M17 12h4" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

/** Distinct Service Icon 2: Verify - Geometric audit checklist box */
export const IconServiceVerify: React.FC<IconProps> = ({
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  title = 'Verify Availability',
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label={title}
    {...rest}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="m8 12 2.5 2.5 5.5-5.5" />
    <path d="M7 18h10" />
  </svg>
);

/** Distinct Service Icon 3: Dispatch - Stepped pathway coordination */
export const IconServiceDispatch: React.FC<IconProps> = ({
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  title = 'Coordinate Dispatch',
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label={title}
    {...rest}
  >
    <path d="M4 6h5v6h6v6h5" />
    <circle cx="4" cy="6" r="2" />
    <circle cx="20" cy="18" r="2" />
  </svg>
);

/** Distinct Service Icon 4: Assist - Verified financial access balance */
export const IconServiceAssist: React.FC<IconProps> = ({
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  title = 'Verified Financial Access',
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label={title}
    {...rest}
  >
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <circle cx="12" cy="15" r="2" />
  </svg>
);

/** Stepped Lines: Hierarchy, operational flow, and triage escalation */
export const IconSteppedLines: React.FC<IconProps> = ({
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  title = 'Sequential Dispatch',
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label={title}
    {...rest}
  >
    <path d="M4 6h4v4h4v4h4v4h4" />
    <circle cx="4" cy="6" r="1.5" fill="currentColor" />
    <circle cx="20" cy="18" r="1.5" fill="currentColor" />
  </svg>
);

/** Checklist Grid: Confirmed clinical readiness audit */
export const IconChecklistGrid: React.FC<IconProps> = ({
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  title = 'Verified Checklist',
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label={title}
    {...rest}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 8h2" />
    <path d="M13 8h4" />
    <path d="M7 12h2" />
    <path d="M13 12h4" />
    <path d="M7 16h2" />
    <path d="M13 16h4" />
  </svg>
);

/** Shield Check: Audited and verified security/integrity */
export const IconShieldCheck: React.FC<IconProps> = ({
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  title = 'Verified Integrity',
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label={title}
    {...rest}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

/** Ambulance: Transport coordination */
export const IconAmbulance: React.FC<IconProps> = ({
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  title = 'Ambulance Transport',
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label={title}
    {...rest}
  >
    <path d="M10 17h4" />
    <path d="M19 17h1a1 1 0 0 0 1-1v-3.5a1 1 0 0 0-.3-.7L18.4 9A1 1 0 0 0 17.6 8H14V5a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h1" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
    <path d="M7 9v4" />
    <path d="M5 11h4" />
  </svg>
);

/** Map Pin: Facility Location */
export const IconMapPin: React.FC<IconProps> = ({
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  title = 'Location Pin',
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label={title}
    {...rest}
  >
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

/** Clock: Freshness and timestamp validation */
export const IconClock: React.FC<IconProps> = ({
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  title = 'Timestamp',
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label={title}
    {...rest}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

/** Alert Triangle: Urgent warnings and stale states */
export const IconAlertTriangle: React.FC<IconProps> = ({
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  title = 'Alert Warning',
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label={title}
    {...rest}
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

/** Phone: Direct voice contact */
export const IconPhone: React.FC<IconProps> = ({
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  title = 'Emergency Telephone',
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label={title}
    {...rest}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

/** Medical Cross / Hospital */
export const IconHospital: React.FC<IconProps> = ({
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  title = 'Healthcare Facility',
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label={title}
    {...rest}
  >
    <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
    <path d="M2 20h20" />
    <path d="M12 8v6" />
    <path d="M9 11h6" />
  </svg>
);

/** Financial Assistance / Shield Wallet */
export const IconAssist: React.FC<IconProps> = ({
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  title = 'Verified Assistance',
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label={title}
    {...rest}
  >
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <path d="M7 15h2" />
    <circle cx="16" cy="15" r="1.5" />
  </svg>
);

/** Check icon */
export const IconCheck: React.FC<IconProps> = ({
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  title = 'Confirmed',
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label={title}
    {...rest}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/** Arrow Right */
export const IconArrowRight: React.FC<IconProps> = ({
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  title = 'Proceed',
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label={title}
    {...rest}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

/** Refresh / Retry */
export const IconRefresh: React.FC<IconProps> = ({
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  title = 'Refresh Verification',
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label={title}
    {...rest}
  >
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

/** Close / X */
export const IconX: React.FC<IconProps> = ({
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  title = 'Dismiss',
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label={title}
    {...rest}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/** Search */
export const IconSearch: React.FC<IconProps> = ({
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  title = 'Search',
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label={title}
    {...rest}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

/** Menu / Hamburger */
export const IconMenu: React.FC<IconProps> = ({
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  title = 'Navigation Menu',
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label={title}
    {...rest}
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

/** Bell / Notification */
export const IconBell: React.FC<IconProps> = ({
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  title = 'Notifications',
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label={title}
    {...rest}
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

/** Plus / Add */
export const IconPlus: React.FC<IconProps> = ({
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  title = 'Add',
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label={title}
    {...rest}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

