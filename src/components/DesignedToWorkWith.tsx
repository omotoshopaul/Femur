import React from 'react';
import { LANDING_CONTENT } from '../content';

export const DesignedToWorkWith: React.FC = () => {
  const { eyebrow, heading, institutions, builtWith, caption } = LANDING_CONTENT.designedToWorkWith;

  return (
    <section className="femur-container py-16 sm:py-24 border-t border-[#CFDACF] text-center">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <span className="font-interface-sans text-scale-eyebrow text-[#4F6B58] normal-case">
            {eyebrow}
          </span>
          <h2 className="font-editorial-serif text-[26px] sm:text-[32px] text-[#0F3F24] font-light leading-snug [text-wrap:balance]">
            {heading}
          </h2>
        </div>

        {/* Institutions as plain text in sans font in deep green, generous gaps, wrapping, 2 cols on mobile */}
        <div className="grid grid-cols-2 md:flex md:flex-wrap items-center justify-center gap-x-6 gap-y-4 pt-4 sm:pt-6">
          {institutions.map((item, idx) => (
            <React.Fragment key={idx}>
              <span className="font-interface-sans text-[15px] sm:text-[16px] text-[#0F3F24] font-medium leading-relaxed">
                {item}
              </span>
              {idx < institutions.length - 1 && (
                <span className="hidden md:inline text-[#CFDACF] select-none" aria-hidden="true">
                  ·
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Second smaller row: Built with Google AI Studio · Firebase */}
        <div className="pt-4 flex items-center justify-center gap-2 text-[14px] font-interface-sans text-[#4F6B58]">
          <span className="font-medium text-[#0F3F24]">{builtWith.label}:</span>
          <span>{builtWith.text}</span>
        </div>

        {/* Caption under both (at least 14px) */}
        <p className="text-[14px] font-interface-sans text-[#4F6B58] max-w-2xl mx-auto leading-normal pt-2">
          {caption}
        </p>
      </div>
    </section>
  );
};
