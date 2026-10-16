import React from 'react';
import { FemurLogo } from './FemurLogo';
import { LANDING_CONTENT } from '../content';

export interface FooterProps {
  onPlaceholderClick: (label: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onPlaceholderClick }) => {
  const { footer } = LANDING_CONTENT;

  return (
    <footer className="w-full bg-[#FFFFFF] border-t border-[#CFDACF] mt-24">
      <div className="femur-container py-14 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 pb-12 border-b border-[#CFDACF]">
          {/* Brand Mark Column */}
          <div className="md:col-span-4 space-y-4">
            <FemurLogo />
            <p className="font-interface-sans text-[15px] text-[#4F6B58] leading-relaxed max-w-xs">
              {LANDING_CONTENT.brand.tagline} Connecting patients, hospitals, and ambulance providers
              across verified healthcare infrastructure.
            </p>
          </div>

          {/* 3 Muted-Header Link Columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footer.columns.map((col) => (
              <div key={col.heading} className="space-y-3">
                <div className="font-interface-sans text-[14px] font-semibold text-[#0F3F24] tracking-wide">
                  {col.heading}
                </div>
                <ul className="space-y-2.5 text-[15px] font-interface-sans text-[#4F6B58]">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith('mailto:') ? (
                        <a href={link.href} className="hover:text-[#0F3F24] transition-colors">
                          {link.label}
                        </a>
                      ) : (
                        <a
                          href={link.href}
                          onClick={(e) => {
                            if (link.href.startsWith('#/')) {
                              e.preventDefault();
                              onPlaceholderClick(link.label);
                            }
                          }}
                          className="hover:text-[#0F3F24] transition-colors"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Small line above bottom row: "FEMUR is a prototype. All data shown is sample data and not live availability." */}
        <div className="pt-6 pb-4">
          <p className="text-[14px] font-interface-sans text-[#4F6B58]">
            {footer.prototypeNotice}
          </p>
        </div>

        {/* Bottom row: "Privacy Policy", "Terms of Service" left; "© 2026 FEMUR" right */}
        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[14px] font-interface-sans text-[#4F6B58]">
          <div className="flex items-center gap-6">
            {footer.legal.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  onPlaceholderClick(item.label);
                }}
                className="hover:text-[#0F3F24] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
          <p>{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};
