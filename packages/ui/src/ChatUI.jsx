import React from 'react';

export const ChatUI = () => {
  return (
    <div className="absolute top-10 right-10 w-80 h-64 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex flex-col shadow-xl overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
            <div className="text-white/80 text-sm"><span className="font-bold text-blue-400">Ronnie:</span> Good luck!</div>
            <div className="text-white/80 text-sm"><span className="font-bold text-red-400">Judd:</span> You too.</div>
        </div>
        <div className="p-2 border-t border-white/10 bg-black/20">
            <input type="text" placeholder="Press Enter to chat..." className="w-full bg-transparent border-none text-white text-sm outline-none placeholder-white/30 px-2 py-1" />
        </div>
    </div>
  );
};
