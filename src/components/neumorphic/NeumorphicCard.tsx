import React from 'react';

export interface NeumorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'extruded' | 'inset' | 'inset-deep' | 'flat';
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'card' | 'base' | 'inner' | 'pill';
  className?: string;
  children?: React.ReactNode;
}

export const NeumorphicCard: React.FC<NeumorphicCardProps> = ({
  variant = 'extruded',
  hoverable = false,
  padding = 'md',
  rounded = 'card',
  className = '',
  children,
  ...props
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4 md:p-6',
    md: 'p-6 md:p-8',
    lg: 'p-8 md:p-12',
    xl: 'p-10 md:p-16 lg:p-20',
  }[padding];

  const roundedClasses = {
    card: 'rounded-[32px]',
    base: 'rounded-2xl',
    inner: 'rounded-xl',
    pill: 'rounded-full',
  }[rounded];

  let shadowClasses = '';
  switch (variant) {
    case 'extruded':
      shadowClasses = `
        shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]
        ${
          hoverable
            ? 'transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[12px_12px_20px_rgb(163,177,198,0.7),-12px_-12px_20px_rgba(255,255,255,0.6)] cursor-pointer'
            : ''
        }
      `;
      break;
    case 'inset':
      shadowClasses = 'shadow-[inset_6px_6px_10px_rgb(163,177,198,0.6),inset_-6px_-6px_10px_rgba(255,255,255,0.5)]';
      break;
    case 'inset-deep':
      shadowClasses = 'shadow-[inset_10px_10px_20px_rgb(163,177,198,0.7),inset_-10px_-10px_20px_rgba(255,255,255,0.6)]';
      break;
    case 'flat':
      shadowClasses = '';
      break;
  }

  return (
    <div
      className={`
        bg-[#E0E5EC] text-[#3D4852]
        border-none
        ${roundedClasses}
        ${paddingClasses}
        ${shadowClasses}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
