import { useState } from 'react';
import { Sprout } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle = 'Ilustrasi Ketahanan Pangan SDG 2',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-emerald-50/60 to-slate-200 text-slate-600 p-6 text-center ${className}`}
      >
        <Sprout className="w-10 h-10 text-emerald-700 mb-3" strokeWidth={1.5} aria-hidden="true" />
        <span className="text-sm font-medium text-slate-700 max-w-xs">{fallbackTitle}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
