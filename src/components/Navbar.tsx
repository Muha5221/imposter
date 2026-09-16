import React from 'react';
import { Volume2, VolumeX, Moon, Sun, HelpCircle, RotateCcw } from 'lucide-react';
import { playClick } from '../utils/audio';

interface NavbarProps {
  soundEnabled: boolean;
  darkMode: boolean;
  roundNumber: number;
  inGame: boolean;
  onToggleSound: () => void;
  onToggleDarkMode: () => void;
  onOpenRules: () => void;
  onResetGame: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  soundEnabled,
  darkMode,
  roundNumber,
  inGame,
  onToggleSound,
  onToggleDarkMode,
  onOpenRules,
  onResetGame,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 transition-colors shadow-sm">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl animate-bounce-subtle">😈</span>
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 font-malayalam">
              ആരാ Imposter?
            </h1>
            {inGame && (
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                റൗണ്ട് {roundNumber}
              </span>
            )}
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-1.5">
          {/* Rules button */}
          <button
            onClick={() => {
              playClick();
              onOpenRules();
            }}
            aria-label="How to play"
            className="p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 active:bg-slate-200 rounded-xl transition-all border border-slate-200 dark:border-slate-700"
            title="എങ്ങനെ കളിക്കാം?"
          >
            <HelpCircle className="w-5 h-5 text-amber-500" />
          </button>

          {/* Sound toggle */}
          <button
            onClick={() => {
              playClick();
              onToggleSound();
            }}
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            className="p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 active:bg-slate-200 rounded-xl transition-all border border-slate-200 dark:border-slate-700"
            title={soundEnabled ? 'ശബ്ദം നിർത്തുക' : 'ശബ്ദം ഓൺ ആക്കുക'}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {/* Dark / Light toggle */}
          <button
            onClick={() => {
              playClick();
              onToggleDarkMode();
            }}
            aria-label="Toggle theme"
            className="p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 active:bg-slate-200 rounded-xl transition-all border border-slate-200 dark:border-slate-700"
            title="തീം മാറ്റുക"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>

          {/* Reset if in active game */}
          {inGame && (
            <button
              onClick={() => {
                playClick();
                if (window.confirm('കളി അവസാനിപ്പിച്ച് പുതിയ സെറ്റപ്പിലേക്ക് പോകണോ?')) {
                  onResetGame();
                }
              }}
              aria-label="Restart game"
              className="p-2 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 active:bg-rose-100 rounded-xl transition-all border border-rose-200 dark:border-rose-800"
              title="പുതിയ കളി"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
