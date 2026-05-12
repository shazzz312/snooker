import React from 'react';

export const PlayerProfile = ({ name, avatar, score }) => {
  return (
    <div className="flex items-center gap-4 bg-white/10 backdrop-blur border border-white/20 p-3 rounded-xl shadow-lg w-64">
      <div className="w-12 h-12 rounded-full bg-gray-600 border border-white/30 overflow-hidden">
        {/* avatar placeholder */}
      </div>
      <div className="flex flex-col">
        <span className="text-white font-bold text-sm uppercase tracking-wide">{name || "Player 1"}</span>
        <span className="text-blue-300 font-mono text-lg">{score || 0}</span>
      </div>
    </div>
  );
};
