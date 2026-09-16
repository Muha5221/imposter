import React from 'react';
import { Play, HelpCircle, Users, Smartphone, Sparkles, ShieldCheck } from 'lucide-react';
import { playClick } from '../utils/audio';

interface HomeScreenProps {
  onStartGame: () => void;
  onOpenRules: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartGame, onOpenRules }) => {
  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-76px)] px-4 py-6 max-w-md mx-auto text-center text-slate-800 animate-fade-in">
      {/* Top Hero Banner */}
      <div className="w-full flex flex-col items-center mt-2">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm animate-pulse-fast">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>പാസ്സ് & പ്ലേ പാർട്ടി ഗെയിം</span>
        </div>

        {/* Big Catchy Logo */}
        <div className="relative my-2">
          <div className="text-6xl sm:text-7xl select-none filter drop-shadow-md mb-2">
            😈
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 font-malayalam leading-tight py-1">
            ആരാ Imposter?
          </h1>
          <p className="text-base sm:text-lg font-bold text-slate-700 mt-2 font-malayalam flex items-center justify-center gap-1.5">
            കൂട്ടുകാരെ പറ്റിക്കാൻ പറ്റുമോ? <span className="text-rose-500">😈</span>
          </p>
        </div>

        {/* Fun Kerala Party Illustration Card */}
        <div className="w-full mt-6 p-4 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/60 relative overflow-hidden">
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 flex items-center space-x-3 shadow-sm">
              <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-sm">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-emerald-800">ഒറ്റ ഫോൺ</div>
                <div className="text-sm font-black text-slate-900 font-malayalam">പാസ്സ് & പ്ലേ</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 flex items-center space-x-3 shadow-sm">
              <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-sm">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-amber-800">കളിക്കാർ</div>
                <div className="text-sm font-black text-slate-900 font-malayalam">3 - 12 പേർ</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 flex items-center space-x-3 shadow-sm">
              <div className="p-2.5 bg-purple-500 text-white rounded-xl shadow-sm">
                <span className="text-lg">🥥</span>
              </div>
              <div>
                <div className="text-[11px] font-bold text-purple-800">വാക്കുകൾ</div>
                <div className="text-sm font-black text-slate-900 font-malayalam">550+ മലയാളം</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 flex items-center space-x-3 shadow-sm">
              <div className="p-2.5 bg-teal-500 text-white rounded-xl shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-teal-800">സ്വകാര്യത</div>
                <div className="text-sm font-black text-slate-900 font-malayalam">രഹസ്യ കാർഡ്</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-3 my-6">
        {/* Main Start Button */}
        <button
          onClick={() => {
            playClick();
            onStartGame();
          }}
          className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98] text-white font-black text-xl rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center space-x-3 transition-all font-malayalam tracking-wide"
        >
          <span>കളി തുടങ്ങാം 🔥</span>
          <Play className="w-6 h-6 fill-current" />
        </button>

        {/* How to Play Button */}
        <button
          onClick={() => {
            playClick();
            onOpenRules();
          }}
          className="w-full py-3.5 px-6 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 font-bold text-base rounded-2xl border border-slate-200 shadow-md flex items-center justify-center space-x-2 transition-all font-malayalam"
        >
          <HelpCircle className="w-5 h-5 text-amber-500" />
          <span>എങ്ങനെ കളിക്കാം? 📖</span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="text-xs text-slate-400 pb-2">
        <p>Made with ❤️ for friends & family in Kerala</p>
      </div>
    </div>
  );
};
