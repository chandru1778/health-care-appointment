import React from 'react';

export interface NeumorphicIconWellProps extends React.HTMLAttributes<HTMLDivElement> {
  depth?: 'inset' | 'inset-deep' | 'inset-sm';
  shape?: 'circle' | 'square' | 'rounded';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  children: React.ReactNode;
}

export const NeumorphicIconWell: React.FC<NeumorphicIconWellProps> = ({
  depth = 'inset-deep',
  shape = 'rounded',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 p-2 text-sm',
    md: 'w-12 h-12 p-3 text-base',
    lg: 'w-16 h-16 p-4 text-xl',
    xl: 'w-20 h-20 p-5 text-2xl',
  }[size];

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-2xl',
    rounded: 'rounded-2xl',
  }[shape];

  let shadowClasses = '';
  switch (depth) {
    case 'inset-deep':
      shadowClasses = 'shadow-[inset_10px_10px_20px_rgb(163,177,198,0.7),inset_-10px_-10px_20px_rgba(255,255,255,0.6)]';
      break;
    case 'inset':
      shadowClasses = 'shadow-[inset_6px_6px_10px_rgb(163,177,198,0.6),inset_-6px_-6px_10px rgba(255,255,255,0.5)]';
      break;
    case 'inset-sm':
      shadowClasses = 'shadow-[inset_3px_3px_6px_rgb(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]';
      break;
  }

  return (
    <div
      className={`
        inline-flex items-center justify-center flex-shrink-0
        bg-[#E0E5EC] text-[#3D4852]
        border-none select-none
        transition-all duration-300 ease-out
        ${shapeClasses}
        ${sizeClasses}
        ${shadowClasses}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
