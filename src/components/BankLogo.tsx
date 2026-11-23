import React from 'react';

interface BankLogoProps {
  className?: string;
  variant?: 'default' | 'white' | 'compact';
}

export const BankLogo: React.FC<BankLogoProps> = ({
  className = '',
  variant = 'default',
}) => {
  const textColor = variant === 'white' ? 'text-white' : 'text-[#012169]';
  const subTextColor = variant === 'white' ? 'text-white/80' : 'text-[#dc1431]';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {variant !== 'compact' && (
        <span
          className={`font-bold tracking-[0.12em] text-lg sm:text-xl md:text-2xl uppercase ${textColor}`}
          style={{ fontFamily: "'Arial', 'Helvetica Neue', sans-serif" }}
        >
          BANK OF AMERICA
        </span>
      )}
      {/* Iconic Flagscape Emblem SVG */}
      <svg
        width="38"
        height="26"
        viewBox="0 0 44 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* Blue left stripes (stars representation) */}
        <path
          d="M2 7.5C7.5 5.2 13 4.3 18.5 4.2L15.8 8.2C10.5 8.5 5.5 9.4 0.5 11.4L2 7.5Z"
          fill={variant === 'white' ? '#ffffff' : '#012169'}
        />
        <path
          d="M0 14.2C5.6 12 11.2 11 16.8 10.8L14.2 14.8C8.8 15.1 3.8 16.1 -0.8 18L0 14.2Z"
          fill={variant === 'white' ? '#ffffff' : '#012169'}
        />
        {/* Red right stripes */}
        <path
          d="M21.5 3.8C28.8 3.8 36.2 5.3 43.2 8.2L40.4 12.2C33.6 9.3 26.4 7.8 19 7.8L21.5 3.8Z"
          fill={variant === 'white' ? '#ff6b81' : '#E31837'}
        />
        <path
          d="M19.2 10.5C26.5 10.5 33.9 12 40.9 14.9L38.1 18.9C31.3 16 24.1 14.5 16.7 14.5L19.2 10.5Z"
          fill={variant === 'white' ? '#ff6b81' : '#E31837'}
        />
        <path
          d="M6.8 20.5C17.2 17.6 28.4 18.5 38.4 22.8L35.4 26.8C25.8 22.6 15.1 21.8 4.4 24.5L6.8 20.5Z"
          fill={variant === 'white' ? '#ff6b81' : '#E31837'}
        />
      </svg>
      {variant === 'compact' && (
        <span className={`font-bold tracking-wider text-base uppercase ${subTextColor}`}>
          BofA
        </span>
      )}
    </div>
  );
};
