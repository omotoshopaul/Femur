import React from 'react';
import { Eyebrow } from './Eyebrow';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  level?: 1 | 2 | 3;
  className?: string;
  isDisplay?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  level = 2,
  className = '',
  isDisplay = false,
}) => {
  const HeadingTag = (`h${level}` as 'h1' | 'h2' | 'h3');

  const headingSizeClass = isDisplay
    ? 'text-scale-display font-light'
    : level === 1
    ? 'text-scale-display font-light'
    : level === 2
    ? 'text-scale-h2 font-light'
    : 'text-scale-h3 font-normal';

  return (
    <div className={`space-y-3.5 max-w-3xl text-left ${className}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <HeadingTag
        className={`font-editorial-serif text-[#0F3F24] ${headingSizeClass} [text-wrap:balance]`}
      >
        {title}
      </HeadingTag>
      {description && (
        <p className="font-interface-sans text-scale-body text-[#4F6B58] max-w-2xl leading-relaxed pt-1">
          {description}
        </p>
      )}
    </div>
  );
};
