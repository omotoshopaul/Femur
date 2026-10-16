import React from 'react';

/**
 * Renders the Nigerian Naira symbol (₦) with guaranteed serif font fallback
 * to prevent tofu boxes in web fonts that lack the U+20A6 glyph in their latin subset.
 */
export function Naira({ className = '' }: { className?: string }) {
  return (
    <span className={`font-editorial-serif font-normal inline-block ${className}`} aria-label="Naira">
      ₦
    </span>
  );
}
