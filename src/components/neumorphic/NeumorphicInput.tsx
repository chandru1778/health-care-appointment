import React, { forwardRef } from 'react';

export interface NeumorphicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const NeumorphicInput = forwardRef<HTMLInputElement, NeumorphicInputProps>(
  (
    {
      label,
      helperText,
      errorText,
      leftIcon,
      rightIcon,
      containerClassName = '',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`flex flex-col gap-2 w-full ${containerClassName}`}>
        {label && (
          <label className="text-sm font-semibold text-[#3D4852] tracking-wide select-none">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-4 z-10 flex items-center justify-center pointer-events-none text-[#6B7280]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={`
              w-full h-12 md:h-14 bg-[#E0E5EC] text-[#3D4852] font-medium
              rounded-2xl border-none outline-none
              shadow-[inset_6px_6px_10px_rgb(163,177,198,0.6),inset_-6px_-6px_10px_rgba(255,255,255,0.5)]
              placeholder:text-[#A0AEC0]
              transition-all duration-300 ease-out
              focus:shadow-[inset_10px_10px_20px_rgb(163,177,198,0.7),inset_-10px_-10px_20px_rgba(255,255,255,0.6)]
              focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 focus:ring-offset-[#E0E5EC]
              ${leftIcon ? 'pl-12' : 'pl-5'}
              ${rightIcon ? 'pr-12' : 'pr-5'}
              ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
              ${errorText ? 'ring-2 ring-[#E53E3E] ring-offset-2 ring-offset-[#E0E5EC]' : ''}
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 z-10 flex items-center justify-center text-[#6B7280]">
              {rightIcon}
            </div>
          )}
        </div>
        {errorText ? (
          <span className="text-xs text-[#E53E3E] font-medium pl-1">{errorText}</span>
        ) : helperText ? (
          <span className="text-xs text-[#6B7280] font-normal pl-1">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

NeumorphicInput.displayName = 'NeumorphicInput';

export interface NeumorphicTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  containerClassName?: string;
}

export const NeumorphicTextarea = forwardRef<HTMLTextAreaElement, NeumorphicTextareaProps>(
  (
    {
      label,
      helperText,
      errorText,
      containerClassName = '',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`flex flex-col gap-2 w-full ${containerClassName}`}>
        {label && (
          <label className="text-sm font-semibold text-[#3D4852] tracking-wide select-none">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          disabled={disabled}
          className={`
            w-full p-4 md:p-5 bg-[#E0E5EC] text-[#3D4852] font-medium
            rounded-2xl border-none outline-none resize-y min-h-[120px]
            shadow-[inset_6px_6px_10px_rgb(163,177,198,0.6),inset_-6px_-6px_10px_rgba(255,255,255,0.5)]
            placeholder:text-[#A0AEC0]
            transition-all duration-300 ease-out
            focus:shadow-[inset_10px_10px_20px_rgb(163,177,198,0.7),inset_-10px_-10px_20px_rgba(255,255,255,0.6)]
            focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 focus:ring-offset-[#E0E5EC]
            ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
            ${errorText ? 'ring-2 ring-[#E53E3E] ring-offset-2 ring-offset-[#E0E5EC]' : ''}
            ${className}
          `}
          {...props}
        />
        {errorText ? (
          <span className="text-xs text-[#E53E3E] font-medium pl-1">{errorText}</span>
        ) : helperText ? (
          <span className="text-xs text-[#6B7280] font-normal pl-1">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

NeumorphicTextarea.displayName = 'NeumorphicTextarea';
