import React from 'react';

export interface CheckTileProps {
  label?: string;
  description?: string;
  className?: string;
  checked?: boolean;
}

/**
 * Small dark-plum (#3B1239) rounded-square check tile
 * Used as a restrained signature accent in checklist grids.
 */
export const CheckTile: React.FC<CheckTileProps> = ({
  label,
  description,
  className = '',
  checked = true,
}) => {
  return (
    <div className={`flex items-start gap-3.5 ${className}`}>
      <div
        className="w-6 h-6 rounded-[8px] bg-[#3B1239] text-[#FFFFFF] flex items-center justify-center shrink-0 mt-0.5 select-none"
        aria-hidden="true"
      >
        {checked ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF]/60" />
        )}
      </div>
      {(label || description) && (
        <div className="space-y-0.5">
          {label && (
            <div className="font-interface-sans text-[16px] font-medium text-[#0F3F24] leading-snug">
              {label}
            </div>
          )}
          {description && (
            <p className="font-interface-sans text-[14px] text-[#4F6B58] leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
