import React from 'react';

export const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-indigo-500/20 border-t-indigo-500 animate-spin`}
      />
      {text && <p className="text-sm text-gray-400 font-medium animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
