import React, { useState } from 'react';

export interface NeumorphicNestedDepthProps {
  size?: 'sm' | 'md' | 'lg';
  centerContent?: React.ReactNode;
  interactive?: boolean;
  className?: string;
}

export const NeumorphicNestedDepth: React.FC<NeumorphicNestedDepthProps> = ({
  size = 'md',
  centerContent,
  interactive = true,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const dimensionClasses = {
    sm: 'w-48 h-48',
    md: 'w-72 h-72',
    lg: 'w-96 h-96',
  }[size];

  return (
    <div
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      className={`
        relative flex items-center justify-center select-none
        transition-transform duration-500 ease-out
        ${isHovered ? 'scale-105' : 'scale-100'}
        ${dimensionClasses}
        ${className}
      `}
    >
      {/* Outer Layer: Extruded (Standard) */}
      <div
        className="w-full h-full rounded-full bg-[#E0E5EC] flex items-center justify-center shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] transition-shadow duration-500 ease-out"
        style={{
          boxShadow: isHovered
            ? '12px 12px 22px rgb(163,177,198,0.7), -12px -12px 22px rgba(255,255,255,0.6)'
            : '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)',
        }}
      >
        {/* Middle Layer: Inset Deep (Well) */}
        <div className="w-3/4 h-3/4 rounded-full bg-[#E0E5EC] flex items-center justify-center shadow-[inset_10px_10px_20px_rgb(163,177,198,0.7),inset_-10px_-10px_20px_rgba(255,255,255,0.6)]">
          {/* Inner Layer: Extruded (Floating Core) */}
          <div
            className={`
              w-1/2 h-1/2 rounded-full bg-[#E0E5EC] flex items-center justify-center
              shadow-[5px_5px_10px_rgb(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)]
              transition-transform duration-700 ease-out text-[#6C63FF]
              ${isHovered ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}
            `}
          >
            {centerContent || (
              <span className="material-symbols-outlined text-3xl select-none">
                spa
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
