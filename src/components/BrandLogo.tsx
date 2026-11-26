import React from 'react';

interface BrandLogoProps {
  variant?: 'dark' | 'light';
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function BrandLogo({
  variant = 'dark',
  showSubtitle = true,
  size = 'md',
  className = '',
}: BrandLogoProps) {
  const primaryColor = variant === 'dark' ? '#3B2416' : '#FFFDF9';
  const accentColor = '#C88746';
  const subColor = variant === 'dark' ? '#6F4E37' : '#E8D5BC';

  const iconSize = size === 'sm' ? 32 : size === 'lg' ? 44 : 36;
  const titleClass =
    size === 'sm'
      ? 'text-lg leading-none'
      : size === 'lg'
        ? 'text-2xl leading-none'
        : 'text-xl leading-none';

  return (
    <span className={`inline-flex items-center gap-2.5 select-none shrink-0 ${className}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* Subtle rising steam forming C & C */}
        <path
          d="M17.5 16C14.8 15.6 13.5 13.6 14 11.2C14.5 8.8 16.6 7.8 18.8 8.3"
          stroke={accentColor}
          strokeWidth="1.9"
          strokeLinecap="round"
        />
        <path
          d="M24.2 15.4C22.4 14.3 22.2 12.1 23.7 10.9C25 9.8 25.1 8.1 23.8 7.2C22.7 6.5 21.6 7.4 22.1 8.8C22.7 10.6 25.5 12.2 26.2 14.2"
          stroke={accentColor}
          strokeWidth="1.45"
          strokeLinecap="round"
          opacity="0.88"
        />
        <path
          d="M32.4 16C29.7 15.6 28.4 13.6 28.9 11.2C29.4 8.8 31.5 7.8 33.7 8.3"
          stroke={accentColor}
          strokeWidth="1.9"
          strokeLinecap="round"
        />
        {/* Modern stoneware tea/coffee cup */}
        <path
          d="M11 21.5H34.5V29C34.5 34.8 29.8 39.5 24 39.5H21.5C15.7 39.5 11 34.8 11 29V21.5Z"
          stroke={primaryColor}
          strokeWidth="2.3"
          strokeLinejoin="round"
        />
        {/* Cup rim detail */}
        <path
          d="M14.5 25.5H31"
          stroke={accentColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* Cup handle */}
        <path
          d="M34.5 23.5H37.2C39.6 23.5 41.5 25.4 41.5 27.8C41.5 30.2 39.6 32.1 37.2 32.1H34.2"
          stroke={primaryColor}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Saucer line */}
        <path
          d="M13 43H32.5"
          stroke={primaryColor}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>

      <span className="flex flex-col text-left">
        <span
          className={`font-serif font-semibold tracking-tight whitespace-nowrap ${titleClass}`}
          style={{ color: primaryColor }}
        >
          Chai &amp; Coc
        </span>
        {showSubtitle && (
          <span
            className="text-[10px] font-semibold tracking-[0.26em] uppercase mt-0.5 whitespace-nowrap"
            style={{ color: subColor }}
          >
            CAFÉ
          </span>
        )}
      </span>
    </span>
  );
}
