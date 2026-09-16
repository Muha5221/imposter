import React, { useState, useRef, useCallback } from 'react';
import { Lock, EyeOff, Sparkles, ChevronRight, Check } from 'lucide-react';
import { Player, WordItem } from '../types/game';
import { playSwipe, playHide } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { PlayerAvatar } from './PlayerAvatar';

interface SwipeRevealCardProps {
  player: Player;
  secretWord: WordItem;
  isLastPlayer: boolean;
  onFinishedViewing: () => void;
}

export const SwipeRevealCard: React.FC<SwipeRevealCardProps> = ({
  player,
  secretWord,
  isLastPlayer,
  onFinishedViewing,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasHidden, setHasHidden] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);

  const triggerReveal = useCallback(() => {
    if (isRevealed) return;
    setIsRevealed(true);
    setDragProgress(1);
    playSwipe();
    triggerHaptic(player.isImposter ? 'imposter' : 'reveal');
  }, [isRevealed, player.isImposter]);

  const triggerHide = useCallback(() => {
    playHide();
    triggerHaptic('medium');
    setHasHidden(true);
  }, []);

  const handleProceedNext = () => {
    onFinishedViewing();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isRevealed) return;
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isRevealed || !trackRef.current) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startXRef.current;
    const trackWidth = trackRef.current.offsetWidth - 64;

    if (trackWidth > 0) {
      const progress = Math.min(1, Math.max(0, deltaX / trackWidth));
      setDragProgress(progress);

      if (progress >= 0.85) {
        setIsDragging(false);
        triggerReveal();
      }
    }
  };

  const handleTouchEnd = () => {
    if (isRevealed) return;
    setIsDragging(false);
    if (dragProgress < 0.85) {
      setDragProgress(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isRevealed) return;
    setIsDragging(true);
    startXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isRevealed || !trackRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    const trackWidth = trackRef.current.offsetWidth - 64;

    if (trackWidth > 0) {
      const progress = Math.min(1, Math.max(0, deltaX / trackWidth));
      setDragProgress(progress);

      if (progress >= 0.85) {
        setIsDragging(false);
        triggerReveal();
      }
    }
  };

  const handleMouseUp = () => {
    if (isRevealed) return;
    setIsDragging(false);
    if (dragProgress < 0.85) {
      setDragProgress(0);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-76px)] px-4 py-5 max-w-md mx-auto text-center select-none animate-fade-in text-slate-800">
      {/* Top Banner with Player Profile */}
      <div className="w-full flex items-center justify-center space-x-2.5 py-2.5 px-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <PlayerAvatar
          avatar={player.avatar}
          photoUrl={player.photoUrl}
          name={player.name}
          size="xs"
          borderClassName="border border-emerald-500"
        />
        <span className="font-bold text-slate-800 text-sm font-malayalam">
          {player.name}
        </span>
      </div>

      {/* Center Display */}
      <div className="my-auto w-full flex flex-col items-center justify-center py-4">
        {hasHidden ? (
          /* State 3: Safely Hidden */
          <div className="w-full max-w-sm p-7 bg-white border-2 border-emerald-500 rounded-3xl shadow-xl flex flex-col items-center text-center animate-scale-up">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 text-3xl shadow-inner border border-emerald-200">
              <Check className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 font-malayalam mb-2">
              വാക്ക് രഹസ്യമാക്കി! 🔒
            </h3>
            <p className="text-sm text-slate-600 font-malayalam leading-relaxed">
              {isLastPlayer
                ? 'എല്ലാ കളിക്കാരും റോൾ കണ്ടുകഴിഞ്ഞു. ഇനി ചർച്ച തുടങ്ങാം!'
                : 'സ്ക്രീൻ സുരക്ഷിതമാണ്. അടുത്ത ആളിന് ഫോൺ കൈമാറൂ!'}
            </p>
          </div>
        ) : !isRevealed ? (
          /* State 1: Masked Card with Swipe Slider */
          <div className="w-full max-w-sm p-6 bg-white border border-slate-200/90 rounded-3xl shadow-xl flex flex-col items-center relative overflow-hidden">
            <div className="w-24 h-24 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mb-4">
              <Lock className="w-10 h-10 text-amber-500" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 font-malayalam mb-1">
              രഹസ്യ വാക്ക്
            </h3>
            <p className="text-xs text-slate-500 font-malayalam mb-6">
              മറ്റാരും കാണാതെ കാണാൻ താഴെ Swipe ചെയ്യുക
            </p>

            {/* Interactive Swipe Slider Track */}
            <div
              ref={trackRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="relative w-full h-16 bg-slate-100 rounded-full p-1.5 border border-slate-300 flex items-center cursor-grab active:cursor-grabbing overflow-hidden shadow-inner touch-none"
            >
              {/* Animated Background Progress Fill */}
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-75"
                style={{ width: `${Math.max(16, dragProgress * 100)}%` }}
              />

              {/* Slider Text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5 font-malayalam">
                  <span>Swipe ചെയ്ത് കാണാം</span>
                  <ChevronRight className="w-4 h-4 text-emerald-600 animate-pulse" />
                </span>
              </div>

              {/* Slider Thumb */}
              <div
                className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 text-white flex items-center justify-center shadow-lg transition-transform duration-75 active:scale-95 border-2 border-white"
                style={{
                  transform: `translateX(${
                    dragProgress * ((trackRef.current?.offsetWidth || 280) - 60)
                  }px)`,
                }}
              >
                <ChevronRight className="w-6 h-6 stroke-[3]" />
              </div>
            </div>

            {/* Fallback Tap Button */}
            <button
              onClick={triggerReveal}
              className="mt-4 text-xs font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-4 transition-colors font-malayalam"
            >
              അല്ലെങ്കിൽ Tap ചെയ്ത് കാണാം 👆
            </button>
          </div>
        ) : (
          /* State 2: Secret Information Revealed */
          <div
            className={`w-full max-w-sm p-6 rounded-3xl shadow-2xl flex flex-col items-center border transition-all animate-scale-up ${
              player.isImposter
                ? 'bg-gradient-to-b from-rose-50 via-white to-rose-100 border-2 border-rose-500'
                : 'bg-gradient-to-b from-emerald-50 via-white to-teal-50 border-2 border-emerald-500'
            }`}
          >
            {player.isImposter ? (
              /* Imposter View */
              <div className="flex flex-col items-center text-center">
                <span className="text-6xl mb-2 animate-bounce-subtle">😈</span>
                <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500 text-white shadow-md mb-2">
                  IMPOSTER
                </span>
                <h3 className="text-3xl font-black text-rose-600 font-malayalam mb-1">
                  നീ ആണ് IMPOSTER!
                </h3>
                <p className="text-lg font-bold text-slate-800 font-malayalam mb-3">
                  വാക്ക് നിനക്ക് അറിയില്ല! 🤫
                </p>

                <div className="p-4 rounded-2xl bg-white/90 border border-rose-200 text-xs text-slate-700 font-malayalam space-y-1.5 shadow-sm">
                  <p className="font-bold text-rose-700">💡 നിന്റെ ലക്ഷ്യം:</p>
                  <p>മറ്റുള്ളവരുടെ സംസാരം ശ്രദ്ധിച്ച് വാക്ക് കണ്ടെത്തുക. ആരും നിന്നെ സംശയിക്കാതിരിക്കാൻ കട്ടക്ക് നിൽക്കുക!</p>
                  <div className="pt-1 text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    വിഭാഗം: {secretWord.category_ml}
                  </div>
                </div>
              </div>
            ) : (
              /* Crewmate View */
              <div className="flex flex-col items-center text-center">
                {/* Category Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2 font-malayalam">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{secretWord.category_ml}</span>
                </div>

                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-malayalam mb-1">
                  നിന്റെ രഹസ്യ വാക്ക്
                </p>

                {/* Big Visual */}
                <div className="w-28 h-28 rounded-3xl bg-white border-2 border-emerald-300 flex items-center justify-center my-3 shadow-md">
                  <span className="text-6xl select-none">{secretWord.image}</span>
                </div>

                {/* Word */}
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 font-malayalam my-1">
                  {secretWord.word_ml}
                </h3>
                <p className="text-sm font-bold text-slate-600 mb-4">
                  ({secretWord.word_en})
                </p>

                <div className="p-3 rounded-2xl bg-emerald-100/70 border border-emerald-300 text-xs font-bold text-emerald-800 font-malayalam shadow-sm">
                  <span>നീ നിരപരാധിയാണ്! Imposter-നെ കണ്ടെത്താൻ ശ്രദ്ധിക്കുക 🕵️‍♂️</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Controls */}
      <div className="w-full">
        {hasHidden ? (
          <button
            onClick={handleProceedNext}
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 active:scale-[0.98] text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all font-malayalam"
          >
            <span>
              {isLastPlayer ? 'എല്ലാവരും Ready ആണ്! 🔥' : 'അടുത്ത ആളിന് ഫോൺ കൊടുക്കൂ →'}
            </span>
          </button>
        ) : isRevealed ? (
          <button
            onClick={triggerHide}
            className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-orange-500 active:scale-[0.98] text-white font-black text-lg rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all font-malayalam"
          >
            <EyeOff className="w-5 h-5" />
            <span>കണ്ടോ? ഇനി മറയ്ക്കാം</span>
          </button>
        ) : (
          <p className="text-xs text-slate-400 font-malayalam">
            സ്ക്രീൻ നിങ്ങളുടെ നേരെ മാത്രം പിടിക്കുക
          </p>
        )}
      </div>
    </div>
  );
};
