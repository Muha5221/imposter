import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Plus, Vote, Mic, Sparkles } from 'lucide-react';
import { Player } from '../types/game';
import { playTick, playUrgentTick, playClick } from '../utils/audio';
import { PlayerAvatar } from './PlayerAvatar';

interface DiscussionScreenProps {
  initialDuration: number;
  starterSpeaker: string | null;
  starterPlayer?: Player;
  onGoToVoting: () => void;
}

export const DiscussionScreen: React.FC<DiscussionScreenProps> = ({
  initialDuration = 120,
  starterSpeaker,
  starterPlayer,
  onGoToVoting,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialDuration);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          if (prev <= 6 && prev > 1) {
            playUrgentTick();
          } else if (prev <= 11) {
            playTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    playClick();
    setIsRunning(!isRunning);
  };

  const addTime = (seconds: number) => {
    playClick();
    setTimeLeft((prev) => prev + seconds);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = (timeLeft / initialDuration) * 100;

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-76px)] px-4 py-5 max-w-md mx-auto text-center animate-fade-in text-slate-800">
      {/* Title Banner */}
      <div className="w-full">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>ഗ്രൂപ്പ് ചർച്ച</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 font-malayalam">
          ആരായിരിക്കും Imposter? 👀
        </h2>
        <p className="text-xs text-slate-500 font-malayalam mt-0.5">
          ഓരോരുത്തരായി തങ്ങളുടെ വാക്കിനെക്കുറിച്ച് സംസാരിക്കുക
        </p>
      </div>

      {/* Starter Speaker Card */}
      {starterSpeaker && (
        <div className="w-full mt-4 p-3 bg-white rounded-2xl border-2 border-indigo-200 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2.5">
            {starterPlayer ? (
              <PlayerAvatar
                avatar={starterPlayer.avatar}
                photoUrl={starterPlayer.photoUrl}
                name={starterPlayer.name}
                size="sm"
                borderClassName="border-2 border-indigo-500"
              />
            ) : (
              <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                <Mic className="w-5 h-5 animate-pulse" />
              </div>
            )}
            <div className="text-left">
              <div className="text-[11px] font-semibold text-slate-500 font-malayalam">
                ആദ്യം സംസാരിക്കേണ്ടത്
              </div>
              <div className="text-sm font-black text-slate-900 font-malayalam">
                🎙️ {starterSpeaker}
              </div>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-200 font-malayalam">
            തുടങ്ങിക്കോളൂ!
          </span>
        </div>
      )}

      {/* Center Circular Timer Display */}
      <div className="my-auto flex flex-col items-center justify-center py-4">
        <div className="relative w-56 h-56 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-slate-200"
              strokeWidth="7"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className={`transition-all duration-1000 stroke-current ${
                timeLeft <= 10
                  ? 'text-rose-500'
                  : timeLeft <= 30
                  ? 'text-amber-500'
                  : 'text-emerald-500'
              }`}
              strokeWidth="7"
              strokeDasharray={2 * Math.PI * 44}
              strokeDashoffset={2 * Math.PI * 44 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Center Digital Clock */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-slate-500 font-bold font-malayalam mb-1">
              ചർച്ചയ്ക്ക് സമയം
            </span>
            <span
              className={`text-4xl sm:text-5xl font-mono font-black tracking-tight ${
                timeLeft <= 10 ? 'text-rose-600 animate-pulse' : 'text-slate-900'
              }`}
            >
              {formattedTime}
            </span>
            {timeLeft === 0 && (
              <span className="text-xs font-bold text-rose-600 font-malayalam mt-1">
                സമയം കഴിഞ്ഞു!
              </span>
            )}
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center space-x-3 mt-6">
          <button
            onClick={toggleTimer}
            className="px-4 py-2 bg-white hover:bg-slate-50 active:scale-95 text-slate-800 rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-slate-200 shadow-sm transition-all font-malayalam"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 text-amber-500" />
                <span>പോസ് (Pause)</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-emerald-600" />
                <span>തുടങ്ങുക</span>
              </>
            )}
          </button>

          <button
            onClick={() => addTime(30)}
            className="px-4 py-2 bg-white hover:bg-slate-50 active:scale-95 text-slate-800 rounded-xl text-xs font-bold flex items-center space-x-1 border border-slate-200 shadow-sm transition-all font-malayalam"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>+30 സെക്കൻഡ്</span>
          </button>
        </div>
      </div>

      {/* Bottom Button to Vote */}
      <div className="w-full">
        <button
          onClick={() => {
            playClick();
            onGoToVoting();
          }}
          className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 active:scale-[0.98] text-white font-black text-lg rounded-2xl shadow-xl shadow-rose-500/25 flex items-center justify-center space-x-2 transition-all font-malayalam"
        >
          <Vote className="w-5 h-5" />
          <span>Imposter ആരാണെന്ന് വോട്ട് ചെയ്യാം! 🎯</span>
        </button>
      </div>
    </div>
  );
};
