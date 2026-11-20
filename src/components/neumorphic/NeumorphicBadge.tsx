import React from 'react';

export interface NeumorphicBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'extruded' | 'inset';
  tone?: 'default' | 'accent' | 'teal' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
  children: React.ReactNode;
}

export const NeumorphicBadge: React.FC<NeumorphicBadgeProps> = ({
  variant = 'inset',
  tone = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3.5 py-1 text-xs md:text-sm',
  }[size];

  const shadowClasses =
    variant === 'extruded'
      ? 'shadow-[3px_3px_6px_rgb(163,177,198,0.6),-3px_-3px_6px_rgba(255,255,255,0.5)]'
      : 'shadow-[inset_2px_2px_4px_rgb(163,177,198,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]';

  const toneClasses = {
    default: 'text-[#3D4852]',
    accent: 'text-[#6C63FF] font-semibold',
    teal: 'text-[#38B2AC] font-semibold',
    danger: 'text-[#E53E3E] font-semibold',
  }[tone];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full bg-[#E0E5EC]
        select-none border-none
        ${sizeClasses}
        ${shadowClasses}
        ${toneClasses}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};
