import React from 'react';
import { Shield, ArrowRight, Smartphone } from 'lucide-react';
import { Player } from '../types/game';
import { playClick } from '../utils/audio';
import { PlayerAvatar } from './PlayerAvatar';

interface PassPhoneScreenProps {
  player: Player;
  playerIndex: number;
  totalPlayers: number;
  onReadyToReveal: () => void;
}

export const PassPhoneScreen: React.FC<PassPhoneScreenProps> = ({
  player,
  playerIndex,
  totalPlayers,
  onReadyToReveal,
}) => {
  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-76px)] px-4 py-6 max-w-md mx-auto text-center animate-fade-in">
      {/* Top Progress indicator */}
      <div className="w-full flex items-center justify-between px-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <span className="text-xs font-bold text-slate-600 font-malayalam">
          കളിക്കാരൻ {playerIndex + 1} / {totalPlayers}
        </span>
        <div className="flex space-x-1.5">
          {Array.from({ length: totalPlayers }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === playerIndex
                  ? 'w-6 bg-emerald-500'
                  : i < playerIndex
                  ? 'w-2 bg-emerald-200'
                  : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Handover Notice */}
      <div className="my-auto w-full flex flex-col items-center">
        {/* Animated Handover Avatar (Photo or Emoji) */}
        <div className="relative mb-6">
          <PlayerAvatar
            avatar={player.avatar}
            photoUrl={player.photoUrl}
            name={player.name}
            size="xl"
            borderClassName="border-4 border-emerald-500 shadow-2xl shadow-emerald-500/20"
          />
          <div className="absolute -bottom-2 -right-2 p-2.5 bg-gradient-to-tr from-emerald-500 to-teal-600 text-white rounded-2xl shadow-lg">
            <Smartphone className="w-5 h-5" />
          </div>
        </div>

        {/* Handover Text */}
        <div className="space-y-2 mb-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-md w-full">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider font-malayalam">
            ഇപ്പോൾ ഫോൺ നൽകേണ്ടത് 📱
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-malayalam">
            "{player.name}"
          </h2>
          <p className="text-sm text-slate-500 font-malayalam mt-1">
            ഫോൺ കൈയിൽ വാങ്ങിയ ശേഷം താഴെ Swipe ചെയ്യുക!
          </p>
        </div>

        {/* Privacy Alert */}
        <div className="flex items-center space-x-2.5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-bold text-amber-800 max-w-sm shadow-sm">
          <Shield className="w-4 h-4 flex-shrink-0 text-amber-600" />
          <span className="text-left font-malayalam">
            മറ്റാരും സ്ക്രീനിലേക്ക് നോക്കുന്നില്ലെന്ന് ഉറപ്പാക്കുക 🤫
          </span>
        </div>
      </div>

      {/* Big Action Button */}
      <div className="w-full">
        <button
          onClick={() => {
            playClick();
            onReadyToReveal();
          }}
          className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 active:scale-[0.98] text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center space-x-2 transition-all font-malayalam"
        >
          <span>Swipe ചെയ്ത് കാണാം →</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
