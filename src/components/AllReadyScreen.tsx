import React from 'react';
import { Play, Sparkles, MessageCircle } from 'lucide-react';
import { playClick } from '../utils/audio';

interface AllReadyScreenProps {
  onStartDiscussion: () => void;
}

export const AllReadyScreen: React.FC<AllReadyScreenProps> = ({ onStartDiscussion }) => {
  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-76px)] px-4 py-6 max-w-md mx-auto text-center animate-fade-in text-slate-800">
      <div className="w-full flex justify-end">
        <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
          റോളുകൾ പൂർത്തിയായി ✅
        </span>
      </div>

      {/* Main Content */}
      <div className="my-auto w-full flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-amber-100 to-orange-100 border-2 border-amber-300 flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-6xl select-none">🔥</span>
          </div>
          <div className="absolute -bottom-2 -right-2 p-2.5 bg-gradient-to-tr from-amber-500 to-orange-500 text-white rounded-2xl shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 font-malayalam mb-2">
          എല്ലാവരും Ready ആണോ? 🔥
        </h2>
        <p className="text-sm text-slate-600 font-malayalam max-w-xs leading-relaxed">
          എല്ലാവരും തങ്ങളുടെ റോൾ കണ്ടുകഴിഞ്ഞു. ഇനി ഫോൺ മേശപ്പുറത്ത് വെച്ച് ചർച്ച തുടങ്ങാം!
        </p>

        {/* Tip Box */}
        <div className="mt-6 p-4 rounded-3xl bg-white border border-slate-200 text-xs text-slate-700 font-malayalam flex items-start space-x-3 text-left max-w-sm shadow-md">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl flex-shrink-0">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="font-black text-slate-900 block mb-0.5">ഒരു കാര്യം ഓർക്കുക:</span>
            വാക്ക് നേരിട്ട് പറയരുത്, പകരം വാക്കുമായി ബന്ധപ്പെട്ട ഒരു ചെറിയ ക്ലൂ മാത്രം ഓരോരുത്തരായി പറയുക!
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="w-full">
        <button
          onClick={() => {
            playClick();
            onStartDiscussion();
          }}
          className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98] text-white font-black text-xl rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center space-x-3 transition-all font-malayalam"
        >
          <span>കളി തുടങ്ങാം! 🚀</span>
          <Play className="w-6 h-6 fill-current" />
        </button>
      </div>
    </div>
  );
};
