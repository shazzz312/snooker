import React from 'react';

export const PowerMeter = () => {
  return (
    <div className="absolute bottom-10 left-10 w-64 h-8 bg-white/10 backdrop-blur border border-white/20 rounded-full overflow-hidden shadow-lg">
      <div className="h-full bg-gradient-to-r from-blue-500 to-red-500 w-1/2"></div>
      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider">Power</div>
    </div>
  );
};
