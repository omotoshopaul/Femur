import React from 'react';

export interface DecorativeParallelCurvesProps {
  className?: string;
  color?: string;
}

/**
 * Flowing parallel line-art curves:
 * Restrained decorative motif defined in Section 2, rendered at 1.5px stroke width.
 */
export const DecorativeParallelCurves: React.FC<DecorativeParallelCurvesProps> = ({
  className = '',
  color = '#CFDACF',
}) => {
  return (
    <svg
      viewBox="0 0 800 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-auto overflow-visible select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <path
        d="M0 180 C 200 180, 250 40, 480 50 C 650 58, 700 140, 800 140"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M0 195 C 200 195, 250 55, 480 65 C 650 73, 700 155, 800 155"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M0 210 C 200 210, 250 70, 480 80 C 650 88, 700 170, 800 170"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M0 225 C 200 225, 250 85, 480 95 C 650 103, 700 185, 800 185"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
};
