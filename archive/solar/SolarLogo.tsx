import React from 'react';

interface SolarLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  monochrome?: boolean;
}

export const SolarLogo: React.FC<SolarLogoProps> = ({
  className = '',
  size = 'md',
  monochrome = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none font-sans ${className}`}>
      {/* Emblem: Shark fin with dynamic solar energy gradient */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_8px_rgba(34,211,238,0.4)]"
        >
          <defs>
            <linearGradient id="solarSharkFinGrad" x1="10%" y1="90%" x2="90%" y2="10%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
            <linearGradient id="solarRaysGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Background subtle solar disc glow */}
          <circle cx="68" cy="32" r="18" fill="url(#solarRaysGrad)" opacity="0.85" />

          {/* Solar Ray Streaks */}
          <path
            d="M 68 8 L 68 18 M 86 18 L 80 26 M 92 32 L 82 32 M 86 46 L 80 40"
            stroke="#FDE68A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Stylized Shark Dorsal Fin / Wave Blade */}
          <path
            d="M 16 84 C 28 84, 44 76, 52 56 C 58 40, 60 22, 54 14 C 48 30, 36 46, 26 58 C 20 66, 16 76, 16 84 Z"
            fill="url(#solarSharkFinGrad)"
          />

          {/* Dynamic forward energy swoosh */}
          <path
            d="M 22 84 C 36 84, 62 78, 86 64 C 74 74, 52 86, 22 84 Z"
            fill="#34D399"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex items-center tracking-wider font-extrabold text-white">
        <span className={`${textSizes[size]} font-black tracking-tight text-white`}>
          SOLAR
        </span>
        <span
          className={`${textSizes[size]} ml-1.5 font-black tracking-tight ${
            monochrome ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400'
          }`}
        >
          SHARK
        </span>
      </div>
    </div>
  );
};
