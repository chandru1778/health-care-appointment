import React from 'react';

export interface NeumorphicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'teal' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  insetActive?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const NeumorphicButton: React.FC<NeumorphicButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  insetActive = true,
  className = '',
  children,
  disabled,
  ...props
}) => {
  // Size classes ensuring touch-friendly 44px+ minimum target
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[38px] rounded-xl font-medium',
    md: 'px-6 py-3 text-base min-h-[48px] rounded-2xl font-semibold',
    lg: 'px-8 py-4 text-lg min-h-[56px] rounded-2xl font-bold',
    icon: 'w-12 h-12 flex items-center justify-center rounded-2xl p-2.5',
  }[size];

  // Variant styling according to Neumorphic Design System
  let variantClasses = '';
  if (variant === 'primary') {
    variantClasses = `
      bg-[#6C63FF] text-white
      shadow-[7px_7px_16px_rgba(108,99,255,0.38),-7px_-7px_16px_rgba(255,255,255,0.7)]
      hover:bg-[#7870FF] hover:-translate-y-0.5
      hover:shadow-[9px_9px_20px_rgba(108,99,255,0.48),-9px_-9px_20px_rgba(255,255,255,0.85)]
      active:translate-y-[0.5px]
      active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.25)]
    `;
  } else if (variant === 'teal') {
    variantClasses = `
      bg-[#38B2AC] text-white
      shadow-[7px_7px_16px_rgba(56,178,172,0.38),-7px_-7px_16px_rgba(255,255,255,0.7)]
      hover:bg-[#319795] hover:-translate-y-0.5
      hover:shadow-[9px_9px_20px_rgba(56,178,172,0.48),-9px_-9px_20px_rgba(255,255,255,0.85)]
      active:translate-y-[0.5px]
      active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.25)]
    `;
  } else if (variant === 'danger') {
    variantClasses = `
      bg-[#E53E3E] text-white
      shadow-[7px_7px_16px_rgba(229,62,62,0.35),-7px_-7px_16px_rgba(255,255,255,0.7)]
      hover:bg-[#C53030] hover:-translate-y-0.5
      active:translate-y-[0.5px]
      active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.25)]
    `;
  } else {
    // Secondary: Background #E0E5EC (molded from surface)
    variantClasses = `
      bg-[#E0E5EC] text-[#3D4852]
      shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]
      hover:-translate-y-0.5
      hover:shadow-[12px_12px_20px_rgb(163,177,198,0.7),-12px_-12px_20px_rgba(255,255,255,0.6)]
      hover:text-[#6C63FF]
      active:translate-y-[0.5px]
      ${
        insetActive
          ? 'active:shadow-[inset_5px_5px_10px_rgb(163,177,198,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.5)]'
          : 'active:shadow-[inset_3px_3px_6px_rgb(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]'
      }
    `;
  }

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer';

  return (
    <button
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2.5
        border-none select-none
        transition-all duration-300 ease-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E0E5EC]
        ${sizeClasses}
        ${variantClasses}
        ${disabledClasses}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
