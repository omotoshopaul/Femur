import React from 'react';

export interface FemurLogoProps {
  className?: string;
  markOnly?: boolean;
}

/**
 * Original FEMUR Logo
 * Brand mark: green rounded square (#0F3F24) with a minimal route line ending in a dot (#FFFFFF),
 * paired with lowercase "femur" wordmark in the editorial serif.
 */
export const FemurLogo: React.FC<FemurLogoProps> = ({ className = '', markOnly = false }) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Original FEMUR Route Mark */}
      <div
        className="w-8 h-8 rounded-[8px] bg-[#0F3F24] flex items-center justify-center shrink-0 shadow-none"
        aria-hidden="true"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Starting node */}
          <circle cx="6" cy="18" r="2" fill="#FFFFFF" />
          {/* Minimal pathway route with 90-degree turn */}
          <path
            d="M6 16V10C6 7.79086 7.79086 6 10 6H15"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Terminal destination dot */}
          <circle cx="18" cy="6" r="2.5" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Wordmark: lowercase "femur" in editorial serif */}
      {!markOnly && (
        <span className="font-editorial-serif text-[26px] font-light text-[#0F3F24] tracking-tight leading-none pt-0.5">
          femur
        </span>
      )}
    </div>
  );
};
