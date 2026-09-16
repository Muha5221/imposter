import React from 'react';
import { X, Smartphone, Eye, Users, Trophy } from 'lucide-react';
import { playClick } from '../utils/audio';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fade-in text-slate-800">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition-colors"
          aria-label="Close rules"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <span className="inline-block text-4xl mb-1">🕵️‍♂️</span>
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700 font-malayalam">
            കളി എങ്ങനെ കളിക്കാം?
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ഒരു ഫോൺ, കൂട്ടുകാരുടെ തരികിടകൾ!
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3.5 text-left">
          {/* Step 1 */}
          <div className="flex items-start space-x-3.5 p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200">
            <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm font-malayalam">
                1. ഫോൺ കൈമാറുക 📱
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                ഓരോരുത്തരായി ഫോൺ വാങ്ങുക. സ്ക്രീനിൽ നിങ്ങളുടെ പേരും ഫോട്ടോയും കാണുമ്പോൾ കാർഡ് വലത്തോട്ട് Swipe ചെയ്ത് രഹസ്യ വാക്ക് കാണുക.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-3.5 p-3.5 bg-rose-50/70 rounded-2xl border border-rose-200">
            <div className="p-2.5 bg-rose-500 text-white rounded-xl shadow-sm">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm font-malayalam">
                2. Imposter സൂക്ഷിക്കുക 😈
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                സാധാരണ കളിക്കാർക്കെല്ലാം ഒരേ വാക്ക് ലഭിക്കും (ഉദാ: 🥥 തേങ്ങ). എന്നാൽ Imposter-ന് വാക്ക് അറിയില്ല!
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-3.5 p-3.5 bg-indigo-50/70 rounded-2xl border border-indigo-200">
            <div className="p-2.5 bg-indigo-500 text-white rounded-xl shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm font-malayalam">
                3. ചർച്ച & ചോദ്യങ്ങൾ 🗣️
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                എല്ലാവരും വാക്ക് കണ്ടുകഴിഞ്ഞാൽ ചർച്ച തുടങ്ങുക! വാക്ക് നേരിട്ട് പറയാതെ ഒരു സൂചന മാത്രം പറയുക. Imposter മറ്റുള്ളവരുടെ സംസാരം കേട്ട് വാക്ക് ഊഹിക്കുക!
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start space-x-3.5 p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-sm">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm font-malayalam">
                4. വോട്ട് & ജയം 🎯
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                ആരാണ് കള്ളം പറയുന്നതെന്ന് കണ്ടെത്തി വോട്ട് ചെയ്യുക! ശരിയായ Imposter-നെ പുറത്താക്കിയാൽ Crewmates ജയിക്കും; അല്ലെങ്കിൽ Imposter രക്ഷപ്പെടും!
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 active:scale-[0.98] text-white font-bold text-base rounded-2xl shadow-lg shadow-emerald-500/25 transition-all font-malayalam"
          >
            മനസ്സിലായി, കളിക്കാം! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
