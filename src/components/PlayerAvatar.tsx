import React from 'react';

interface PlayerAvatarProps {
  avatar: string;
  photoUrl?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  borderClassName?: string;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  avatar,
  photoUrl,
  name = '',
  size = 'md',
  className = '',
  borderClassName = '',
}) => {
  const sizeClasses = {
    xs: 'w-7 h-7 text-sm',
    sm: 'w-10 h-10 text-lg',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-20 h-20 text-4xl',
    xl: 'w-28 h-28 text-5xl',
    '2xl': 'w-36 h-36 text-6xl',
  };

  const border = borderClassName || 'border-2 border-emerald-400/80 shadow-md';

  if (photoUrl) {
    return (
      <div
        className={`relative rounded-full overflow-hidden flex-shrink-0 bg-slate-100 ${sizeClasses[size]} ${border} ${className}`}
      >
        <img
          src={photoUrl}
          alt={name || 'Player'}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-tr from-amber-100 via-emerald-100 to-teal-100 select-none ${sizeClasses[size]} ${border} ${className}`}
    >
      <span>{avatar}</span>
    </div>
  );
};
