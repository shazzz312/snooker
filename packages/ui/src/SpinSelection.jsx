import React from 'react';

export const SpinSelection = () => {
  return (
    <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 backdrop-blur border border-white/20 rounded-full flex items-center justify-center shadow-lg relative">
        <div className="w-24 h-24 rounded-full border-2 border-white/30 relative">
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
        </div>
        <div className="absolute -top-6 text-white text-xs font-bold uppercase tracking-wider">Spin</div>
    </div>
  );
};
