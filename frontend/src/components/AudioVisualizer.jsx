import React from 'react';

export const AudioVisualizer = ({ isActive = false, mode = 'recording', barsCount = 7 }) => {
  if (!isActive) return null;

  const barColors = mode === 'recording' 
    ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]' 
    : 'bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.6)]';

  return (
    <div className="flex items-center justify-center gap-1.5 h-8 px-3">
      {Array.from({ length: barsCount }).map((_, index) => {
        // Stagger animation delays for natural wave motion
        const delay = (index * 0.15).toFixed(2);
        const duration = (0.7 + (index % 3) * 0.2).toFixed(2);

        return (
          <span
            key={index}
            className={`w-1 rounded-full transition-all ${barColors}`}
            style={{
              animation: `soundWave ${duration}s ease-in-out infinite alternate`,
              animationDelay: `${delay}s`,
              minHeight: '8px',
            }}
          />
        );
      })}
    </div>
  );
};

export default AudioVisualizer;
