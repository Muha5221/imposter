import React, { useState } from 'react';
import { Vote, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Player } from '../types/game';
import { playClick } from '../utils/audio';
import { PlayerAvatar } from './PlayerAvatar';

interface VotingScreenProps {
  players: Player[];
  onBackToDiscussion: () => void;
  onSubmitVote: (votedPlayerId: string) => void;
}

export const VotingScreen: React.FC<VotingScreenProps> = ({
  players,
  onBackToDiscussion,
  onSubmitVote,
}) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const handleSelectPlayer = (id: string) => {
    playClick();
    setSelectedPlayerId(id);
    setShowConfirmModal(true);
  };

  const confirmVote = () => {
    if (!selectedPlayerId) return;
    playClick();
    onSubmitVote(selectedPlayerId);
  };

  const selectedPlayer = players.find((p) => p.id === selectedPlayerId);

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-76px)] px-4 py-5 max-w-md mx-auto text-center animate-fade-in text-slate-800 relative">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={() => {
            playClick();
            onBackToDiscussion();
          }}
          className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-2xl shadow-sm border border-slate-200 transition-colors"
          aria-label="Back to discussion"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-rose-600 font-malayalam">
            വോട്ടിംഗ് സമയം 🗳️
          </h2>
          <p className="text-xs text-slate-500 font-malayalam">
            Imposter ആരാണെന്ന് ഗ്രൂപ്പായി തീരുമാനിക്കൂ
          </p>
        </div>
        <div className="w-9" />
      </div>

      {/* Grid of Players */}
      <div className="w-full my-auto py-2">
        <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {players.map((player) => {
            const isSelected = selectedPlayerId === player.id;
            return (
              <button
                key={player.id}
                type="button"
                onClick={() => handleSelectPlayer(player.id)}
                className={`p-4 rounded-3xl flex flex-col items-center justify-center transition-all border text-center active:scale-95 shadow-sm ${
                  isSelected
                    ? 'bg-rose-50 border-2 border-rose-500 shadow-md shadow-rose-200'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div className="mb-2">
                  <PlayerAvatar
                    avatar={player.avatar}
                    photoUrl={player.photoUrl}
                    name={player.name}
                    size="md"
                    borderClassName="border-2 border-rose-300 shadow"
                  />
                </div>
                <h4 className="font-bold text-sm text-slate-900 font-malayalam truncate max-w-full">
                  {player.name}
                </h4>
                <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 mt-1.5 flex items-center gap-1 font-malayalam">
                  <Vote className="w-3 h-3" />
                  <span>വോട്ട് ചെയ്യുക</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xs bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-center animate-scale-up text-slate-800">
            <div className="mx-auto mb-3 flex justify-center">
              <PlayerAvatar
                avatar={selectedPlayer.avatar}
                photoUrl={selectedPlayer.photoUrl}
                name={selectedPlayer.name}
                size="lg"
                borderClassName="border-4 border-rose-500 shadow-lg"
              />
            </div>

            <h3 className="text-xl font-black text-slate-900 font-malayalam mb-1">
              തീർച്ചയാണോ? ⚖️
            </h3>
            <p className="text-sm text-slate-600 font-malayalam mb-5">
              <span className="text-rose-600 font-black text-base">"{selectedPlayer.name}"</span> ആണ് Imposter എന്ന് ഉറപ്പാണോ?
            </p>

            <div className="space-y-2.5">
              <button
                onClick={confirmVote}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-500 to-red-600 active:scale-95 text-white font-black text-sm rounded-2xl shadow-lg shadow-rose-500/30 flex items-center justify-center space-x-2 transition-all font-malayalam"
              >
                <CheckCircle className="w-4 h-4" />
                <span>അതെ, പുറത്താക്കുക! 🎯</span>
              </button>

              <button
                onClick={() => setShowConfirmModal(false)}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 font-bold text-xs rounded-xl border border-slate-200 transition-all font-malayalam"
              >
                മറ്റൊരാളെ നോക്കാം
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Hint */}
      <div className="w-full pt-2">
        <p className="text-xs text-slate-400 font-malayalam">
          ഏറ്റവും കൂടുതൽ ആളുകൾ സംശയിക്കുന്ന ആളുടെ കാർഡിൽ ക്ലിക്ക് ചെയ്യുക
        </p>
      </div>
    </div>
  );
};
