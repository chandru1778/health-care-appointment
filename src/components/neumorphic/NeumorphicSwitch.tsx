import React from 'react';

export interface NeumorphicSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const NeumorphicSwitch: React.FC<NeumorphicSwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = '',
}) => {
  return (
    <label
      className={`
        inline-flex items-center gap-4 cursor-pointer select-none
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `}
    >
      {/* Molded Inset Track */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`
          relative w-16 h-9 rounded-full bg-[#E0E5EC] border-none p-1
          shadow-[inset_4px_4px_8px_rgb(163,177,198,0.7),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]
          transition-colors duration-300 ease-out cursor-pointer
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E0E5EC]
        `}
      >
        {/* Extruded Knob */}
        <span
          className={`
            block w-7 h-7 rounded-full
            transition-transform duration-300 ease-out
            ${
              checked
                ? 'translate-x-7 bg-[#6C63FF] shadow-[2px_2px_6px_rgba(108,99,255,0.4),-2px_-2px_6px_rgba(255,255,255,0.7)]'
                : 'translate-x-0 bg-[#E0E5EC] shadow-[3px_3px_6px_rgb(163,177,198,0.7),-3px_-3px_6px_rgba(255,255,255,0.6)]'
            }
          `}
        />
      </button>

      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-sm font-semibold text-[#3D4852]">{label}</span>}
          {description && <span className="text-xs text-[#6B7280]">{description}</span>}
        </div>
      )}
    </label>
  );
};
