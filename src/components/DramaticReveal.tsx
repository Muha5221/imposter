import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, ArrowRight, Skull } from 'lucide-react';
import { Player, WordItem } from '../types/game';
import { playHeartbeat, playBuzzer, playFanfare, playClick } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { PlayerAvatar } from './PlayerAvatar';

interface DramaticRevealProps {
  players: Player[];
  votedPlayerId: string;
  secretWord: WordItem;
  onContinueToResults: () => void;
}

export const DramaticReveal: React.FC<DramaticRevealProps> = ({
  players,
  votedPlayerId,
  secretWord,
  onContinueToResults,
}) => {
  const [stage, setStage] = useState<'suspense' | 'revealed'>('suspense');

  const votedPlayer = players.find((p) => p.id === votedPlayerId);
  const isImposter = votedPlayer?.isImposter ?? false;

  useEffect(() => {
    playHeartbeat();
    triggerHaptic('heavy');

    const heartbeatTimer = setTimeout(() => {
      playHeartbeat();
    }, 1200);

    const revealTimer = setTimeout(() => {
      setStage('revealed');

      if (isImposter) {
        playFanfare();
        triggerHaptic('reveal');

        try {
          confetti({
            particleCount: 130,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#10B981', '#F59E0B', '#3B82F6', '#EC4899'],
          });
        } catch {
          // fallback
        }
      } else {
        playBuzzer();
        triggerHaptic('imposter');
      }
    }, 2600);

    return () => {
      clearTimeout(heartbeatTimer);
      clearTimeout(revealTimer);
    };
  }, [isImposter]);

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-76px)] px-4 py-6 max-w-md mx-auto text-center animate-fade-in select-none text-slate-800">
      <div className="w-full flex justify-center">
        <span className="text-xs font-bold px-3 py-1 bg-white text-slate-600 rounded-full border border-slate-200 shadow-sm">
          വിധിനിർണ്ണയം ⚖️
        </span>
      </div>

      {/* Center Reveal Area */}
      <div className="my-auto w-full flex flex-col items-center justify-center py-4">
        {stage === 'suspense' ? (
          /* Suspense Phase */
          <div className="flex flex-col items-center animate-pulse">
            <div className="mb-6 flex justify-center">
              {votedPlayer && (
                <PlayerAvatar
                  avatar={votedPlayer.avatar}
                  photoUrl={votedPlayer.photoUrl}
                  name={votedPlayer.name}
                  size="2xl"
                  borderClassName="border-4 border-rose-500 shadow-2xl shadow-rose-500/30"
                />
              )}
            </div>

            <h3 className="text-3xl font-black text-slate-900 font-malayalam mb-2">
              നമുക്ക് നോക്കാം… 👀
            </h3>
            <p className="text-base font-bold text-slate-600 font-malayalam">
              {votedPlayer?.name} Imposter ആണോ?
            </p>
          </div>
        ) : (
          /* Revealed Phase */
          <div className="flex flex-col items-center w-full animate-scale-up">
            {isImposter ? (
              /* Accused WAS Imposter */
              <div className="w-full p-6 bg-gradient-to-b from-emerald-50 via-white to-teal-50 border-2 border-emerald-500 rounded-3xl shadow-2xl">
                <div className="flex justify-center mb-4">
                  {votedPlayer && (
                    <PlayerAvatar
                      avatar={votedPlayer.avatar}
                      photoUrl={votedPlayer.photoUrl}
                      name={votedPlayer.name}
                      size="xl"
                      borderClassName="border-4 border-emerald-500 shadow-xl"
                    />
                  )}
                </div>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-emerald-500 text-white shadow-md mb-2">
                  <Trophy className="w-4 h-4" />
                  <span>CREWMATES ജയിച്ചു! 🎉</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-emerald-700 font-malayalam mb-1">
                  അയ്യോ പിടിക്കപ്പെട്ടു! 😈
                </h3>
                <p className="text-base font-bold text-slate-800 font-malayalam mb-4">
                  <span className="text-emerald-700 text-xl font-black">"{votedPlayer?.name}"</span> ആയിരുന്നു ശരിയായ IMPOSTER!
                </p>

                <div className="p-3 bg-emerald-100/70 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-800 font-malayalam">
                  കൂട്ടുകാർ സമർത്ഥമായി കള്ളനെ കണ്ടെത്തി! 👏
                </div>
              </div>
            ) : (
              /* Accused was INNOCENT */
              <div className="w-full p-6 bg-gradient-to-b from-rose-50 via-white to-red-50 border-2 border-rose-500 rounded-3xl shadow-2xl">
                <div className="flex justify-center mb-4">
                  {votedPlayer && (
                    <PlayerAvatar
                      avatar={votedPlayer.avatar}
                      photoUrl={votedPlayer.photoUrl}
                      name={votedPlayer.name}
                      size="xl"
                      borderClassName="border-4 border-rose-500 shadow-xl"
                    />
                  )}
                </div>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-rose-600 text-white mb-2 shadow-md">
                  <Skull className="w-4 h-4" />
                  <span>IMPOSTER ജയിച്ചു! 😈</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-rose-600 font-malayalam mb-1">
                  അയ്യോ! നിരപരാധിയെ തൂക്കി! 😭
                </h3>
                <p className="text-base font-bold text-slate-800 font-malayalam mb-4">
                  <span className="text-rose-600 text-xl font-black">"{votedPlayer?.name}"</span> Imposter അല്ലായിരുന്നു!
                </p>

                <div className="p-3 bg-rose-100/70 rounded-2xl border border-rose-200 text-xs font-bold text-rose-800 font-malayalam">
                  യഥാർത്ഥ Imposter കൂട്ടുകാരെ പറ്റിച്ച് രക്ഷപ്പെട്ടു! 😈
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <div className="w-full">
        {stage === 'revealed' ? (
          <button
            onClick={() => {
              playClick();
              onContinueToResults();
            }}
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 active:scale-[0.98] text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all font-malayalam"
          >
            <span>പൂർണ്ണ വിവരങ്ങൾ കാണാം</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="h-14 flex items-center justify-center text-xs text-slate-400 font-malayalam">
            ഹൃദയമിടിപ്പ് മുറുകുന്നു... 💓
          </div>
        )}
      </div>
    </div>
  );
};
