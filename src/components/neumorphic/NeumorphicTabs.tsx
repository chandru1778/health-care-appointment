import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface NeumorphicTabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const NeumorphicTabs: React.FC<NeumorphicTabsProps> = ({
  tabs,
  activeId,
  onChange,
  className = '',
}) => {
  return (
    <div
      className={`
        inline-flex p-1.5 rounded-2xl bg-[#E0E5EC] max-w-full overflow-x-auto no-scrollbar
        shadow-[inset_4px_4px_8px_rgb(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]
        ${className}
      `}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap
              transition-all duration-300 ease-out border-none select-none cursor-pointer
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF] focus-visible:ring-offset-1 focus-visible:ring-offset-[#E0E5EC]
              ${
                isActive
                  ? 'bg-[#E0E5EC] text-[#6C63FF] shadow-[5px_5px_10px_rgb(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.6)]'
                  : 'bg-transparent text-[#6B7280] hover:text-[#3D4852]'
              }
            `}
          >
            {tab.icon && <span className="text-base">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`
                  text-xs px-2 py-0.5 rounded-full font-bold
                  ${
                    isActive
                      ? 'bg-[#6C63FF] text-white'
                      : 'bg-[#E0E5EC] text-[#6B7280] shadow-[inset_1px_1px_3px_rgb(163,177,198,0.5),inset_-1px_-1px_3px_rgba(255,255,255,0.5)]'
                  }
                `}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
