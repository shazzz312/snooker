import React from 'react';
import { PlayerProfile } from './PlayerProfile';

export const LiveScore = () => {
  return (
    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 flex items-center gap-8 bg-black/40 backdrop-blur-md border border-white/10 px-8 py-4 rounded-2xl shadow-2xl">
      <PlayerProfile name="Ronnie" score={147} />
      <div className="flex flex-col items-center">
        <span className="text-white/50 text-xs uppercase tracking-widest mb-1">Frame 1</span>
        <span className="text-white text-2xl font-bold font-mono">1 - 0</span>
      </div>
      <PlayerProfile name="Judd" score={0} />
    </div>
  );
};
