import React from 'react';

export interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

/**
 * Small plain-case eyebrow label.
 * Sans-serif, normal case (NOT uppercase), deep muted green (#4F6B58), 15px.
 */
export const Eyebrow: React.FC<EyebrowProps> = ({
  children,
  className = '',
  as: Component = 'p',
}) => {
  return (
    <Component
      className={`font-interface-sans text-[15px] font-medium leading-snug text-[#4F6B58] normal-case tracking-normal ${className}`}
    >
      {children}
    </Component>
  );
};
