import React from 'react';

export interface StatBlockProps {
  numeral: string;
  caption: string;
  detail?: string;
  className?: string;
}

/**
 * Very large, light-weight serif numerals for statistics,
 * with a small sans caption beneath.
 */
export const StatBlock: React.FC<StatBlockProps> = ({
  numeral,
  caption,
  detail,
  className = '',
}) => {
  return (
    <div className={`space-y-2 text-left ${className}`}>
      <div className="font-editorial-serif font-light text-[52px] sm:text-[64px] lg:text-[76px] leading-none text-[#0F3F24] tracking-tight">
        {numeral}
      </div>
      <p className="font-interface-sans text-[15px] sm:text-[16px] text-[#4F6B58] leading-snug max-w-xs">
        {caption}
      </p>
      {detail && (
        <span className="inline-block font-interface-sans text-[14px] text-[#4F6B58]/80 font-normal">
          {detail}
        </span>
      )}
    </div>
  );
};
