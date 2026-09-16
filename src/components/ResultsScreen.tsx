import React from 'react';
import { RotateCcw, PlusCircle, Award } from 'lucide-react';
import { Player, WordItem } from '../types/game';
import { playClick } from '../utils/audio';
import { PlayerAvatar } from './PlayerAvatar';

interface ResultsScreenProps {
  winner: 'crewmates' | 'imposters' | null;
  players: Player[];
  secretWord: WordItem;
  onPlayAgain: () => void;
  onNewGame: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  winner,
  players,
  secretWord,
  onPlayAgain,
  onNewGame,
}) => {
  const imposters = players.filter((p) => p.isImposter);

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-76px)] px-4 py-5 max-w-md mx-auto text-center animate-fade-in text-slate-800 pb-20">
      {/* Winner Hero Banner */}
      <div className="w-full mb-3">
        {winner === 'crewmates' ? (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-xl shadow-emerald-500/20">
            <span className="text-4xl mb-1 block">🏆</span>
            <h2 className="text-2xl sm:text-3xl font-black font-malayalam">
              Crewmates ജയിച്ചു! 🎉
            </h2>
            <p className="text-xs text-emerald-100 font-malayalam mt-0.5">
              ഇംപോസ്റ്ററെ കയ്യോടെ പൊക്കി!
            </p>
          </div>
        ) : (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-500 via-red-500 to-rose-600 text-white shadow-xl shadow-rose-500/20">
            <span className="text-4xl mb-1 block">😈</span>
            <h2 className="text-2xl sm:text-3xl font-black font-malayalam">
              Imposter ജയിച്ചു! 👑
            </h2>
            <p className="text-xs text-rose-100 font-malayalam mt-0.5">
              കൂട്ടുകാരെ സമർത്ഥമായി കബളിപ്പിച്ചു!
            </p>
          </div>
        )}
      </div>

      {/* Secret Word Reveal Card */}
      <div className="w-full bg-white border border-slate-200 rounded-3xl p-4 shadow-sm mb-3 text-left">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 font-malayalam">രഹസ്യ വാക്ക്</span>
          <span className="text-[11px] font-bold px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
            {secretWord.category_ml}
          </span>
        </div>

        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-3xl shadow-inner">
            {secretWord.image}
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 font-malayalam leading-tight">
              {secretWord.word_ml}
            </h3>
            <p className="text-xs font-bold text-slate-500">
              {secretWord.word_en}
            </p>
          </div>
        </div>
      </div>

      {/* Imposter Identification */}
      <div className="w-full bg-white border border-slate-200 rounded-3xl p-4 shadow-sm mb-3 text-left">
        <span className="text-xs font-bold text-slate-500 font-malayalam block mb-2">
          ആരായിരുന്നു Imposter? 😈
        </span>
        <div className="flex flex-wrap gap-2">
          {imposters.map((imp) => (
            <div
              key={imp.id}
              className="flex items-center space-x-2.5 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-2xl shadow-sm"
            >
              <PlayerAvatar
                avatar={imp.avatar}
                photoUrl={imp.photoUrl}
                name={imp.name}
                size="xs"
                borderClassName="border border-rose-400"
              />
              <span className="text-xs font-black text-rose-800 font-malayalam">
                {imp.name}
              </span>
              <span className="text-[9px] font-black bg-rose-600 text-white px-1.5 py-0.5 rounded">
                IMPOSTER
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard / Player Scores */}
      <div className="w-full bg-white border border-slate-200 rounded-3xl p-4 shadow-sm mb-5 text-left">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-slate-500 font-malayalam flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>സ്കോർ ബോർഡ്</span>
          </span>
        </div>

        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {[...players]
            .sort((a, b) => b.score - a.score)
            .map((player, idx) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="w-4 font-black text-slate-400">#{idx + 1}</span>
                  <PlayerAvatar
                    avatar={player.avatar}
                    photoUrl={player.photoUrl}
                    name={player.name}
                    size="xs"
                    borderClassName="border border-slate-300"
                  />
                  <span className="font-bold text-slate-800 font-malayalam">
                    {player.name}
                  </span>
                  {player.isImposter && <span className="text-xs">😈</span>}
                </div>
                <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  {player.score} പോയിന്റ്
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="w-full space-y-2.5">
        <button
          onClick={() => {
            playClick();
            onPlayAgain();
          }}
          className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-[0.98] text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all font-malayalam"
        >
          <RotateCcw className="w-5 h-5" />
          <span>വീണ്ടും കളിക്കാം 🔄</span>
        </button>

        <button
          onClick={() => {
            playClick();
            onNewGame();
          }}
          className="w-full py-3.5 px-6 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 font-bold text-base rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center space-x-2 transition-all font-malayalam"
        >
          <PlusCircle className="w-5 h-5 text-amber-500" />
          <span>പുതിയ Game 🎮</span>
        </button>
      </div>
    </div>
  );
};
