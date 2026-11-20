import { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIcon?: string;
  fallbackLabel?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackIcon = 'medical_services',
  fallbackLabel,
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    const initials = (fallbackLabel || alt)
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('');

    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-primary-fixed/40 to-secondary-fixed/40 text-primary select-none ${className}`}
        aria-label={alt}
        role="img"
      >
        {initials ? (
          <span className="font-bold text-sm tracking-tight">{initials}</span>
        ) : (
          <span className="material-symbols-outlined text-[24px]">{fallbackIcon}</span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
