import React, { useState } from 'react';
import { Users, UserX, Sparkles, Shuffle, ArrowRight, ArrowLeft, Camera, Edit3 } from 'lucide-react';
import { GameConfig, CategoryId } from '../types/game';
import { CATEGORIES } from '../data/categories';
import { DEFAULT_PLAYERS, FUN_AVATARS } from '../data/defaultNames';
import { playClick } from '../utils/audio';
import { PlayerSetupInput } from '../utils/gameLogic';
import { CameraPhotoModal } from './CameraPhotoModal';
import { PlayerAvatar } from './PlayerAvatar';

interface SetupScreenProps {
  onBack: () => void;
  onStartGame: (playerInputs: PlayerSetupInput[], config: GameConfig) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onBack, onStartGame }) => {
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [imposterCount, setImposterCount] = useState<number>(1);
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [selectedCategories, setSelectedCategories] = useState<(CategoryId | 'all')[]>(['all']);

  // Player profiles with name, avatar, and optional camera photo
  const [players, setPlayers] = useState<PlayerSetupInput[]>(() => {
    return DEFAULT_PLAYERS.slice(0, 4).map((p) => ({
      name: p.name,
      avatar: p.avatar,
    }));
  });

  // Camera modal state
  const [editingPlayerIndex, setEditingPlayerIndex] = useState<number | null>(null);

  // Handle player count change
  const handlePlayerCountChange = (newCount: number) => {
    if (newCount < 3 || newCount > 12) return;
    playClick();
    setPlayerCount(newCount);

    if (newCount > players.length) {
      const added: PlayerSetupInput[] = [];
      for (let i = players.length; i < newCount; i++) {
        const defaultProfile = DEFAULT_PLAYERS[i] || {
          name: `കളിക്കാരൻ ${i + 1}`,
          avatar: FUN_AVATARS[i % FUN_AVATARS.length],
        };
        added.push({
          name: defaultProfile.name,
          avatar: defaultProfile.avatar,
        });
      }
      setPlayers([...players, ...added]);
    } else {
      setPlayers(players.slice(0, newCount));
    }

    const maxAllowedImposters = Math.max(1, Math.floor((newCount - 1) / 2));
    if (imposterCount > maxAllowedImposters) {
      setImposterCount(maxAllowedImposters);
    }
  };

  const maxImposters = Math.max(1, Math.min(3, Math.floor((playerCount - 1) / 2)));

  const handleNameChange = (index: number, newName: string) => {
    const updated = [...players];
    updated[index] = { ...updated[index], name: newName };
    setPlayers(updated);
  };

  const handleAvatarOrPhotoChange = (avatar: string, photoUrl?: string) => {
    if (editingPlayerIndex === null) return;
    const updated = [...players];
    updated[editingPlayerIndex] = {
      ...updated[editingPlayerIndex],
      avatar,
      photoUrl,
    };
    setPlayers(updated);
  };

  const randomizeNames = () => {
    playClick();
    const shuffled = [...DEFAULT_PLAYERS].sort(() => Math.random() - 0.5);
    const newPlayers: PlayerSetupInput[] = Array.from({ length: playerCount }, (_, i) => {
      const p = shuffled[i] || { name: `കളിക്കാരൻ ${i + 1}`, avatar: '😎' };
      return {
        name: p.name,
        avatar: p.avatar,
        photoUrl: players[i]?.photoUrl, // keep photo if taken
      };
    });
    setPlayers(newPlayers);
  };

const toggleCategory = (catId: CategoryId | 'all') => {
  playClick();

  if (catId === 'all') {
    setSelectedCategories(['all']);
    return;
  }

  let updated: (CategoryId | 'all')[] = selectedCategories.filter(
    (c) => c !== 'all'
  );

  if (updated.includes(catId)) {
    updated = updated.filter((c) => c !== catId);

    if (updated.length === 0) {
      updated = ['all'];
    }
  } else {
    updated.push(catId);
  }

  setSelectedCategories(updated);
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    const cleanedPlayers: PlayerSetupInput[] = players.map((p, i) => ({
      name: p.name.trim() || `പ്ലെയർ ${i + 1}`,
      avatar: p.avatar,
      photoUrl: p.photoUrl,
    }));

    const config: GameConfig = {
      playerCount,
      imposterCount,
      difficulty,
      selectedCategories,
      timerDuration: 120,
    };

    onStartGame(cleanedPlayers, config);
  };

  const editingPlayer = editingPlayerIndex !== null ? players[editingPlayerIndex] : null;

  return (
    <div className="max-w-md mx-auto px-4 py-5 text-slate-800 animate-fade-in pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => {
            playClick();
            onBack();
          }}
          className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-2xl shadow-sm border border-slate-200 transition-colors"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700 font-malayalam">
            ഗെയിം സെറ്റപ്പ് ⚙️
          </h2>
          <p className="text-xs text-slate-500 font-malayalam">
            കളിക്കാരെ ക്രമീകരിക്കൂ
          </p>
        </div>
        <div className="w-9" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Player Count Card */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-md shadow-slate-200/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Users className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-800 text-sm font-malayalam">
                കളിക്കാരുടെ എണ്ണം
              </span>
            </div>
            <span className="text-xl font-black text-emerald-700 px-3 py-0.5 bg-emerald-50 rounded-xl border border-emerald-200">
              {playerCount} പേർ
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={playerCount <= 3}
              onClick={() => handlePlayerCountChange(playerCount - 1)}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-2xl font-black text-xl text-slate-800 active:scale-95 transition-all"
            >
              -
            </button>
            <input
              type="range"
              min="3"
              max="12"
              value={playerCount}
              onChange={(e) => handlePlayerCountChange(Number(e.target.value))}
              className="flex-[3] accent-emerald-600 h-2.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <button
              type="button"
              disabled={playerCount >= 12}
              onClick={() => handlePlayerCountChange(playerCount + 1)}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-2xl font-black text-xl text-slate-800 active:scale-95 transition-all"
            >
              +
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 text-center">
            (3 മുതൽ 12 കളിക്കാർ വരെ തിരഞ്ഞെടുക്കാം)
          </p>
        </div>

        {/* Players List with Camera Photo Support */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-md shadow-slate-200/50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="font-bold text-slate-800 text-sm font-malayalam block">
                കളിക്കാരും ഫോട്ടോയും 📸
              </span>
              <span className="text-[11px] text-slate-400 font-malayalam">
                ഫോട്ടോ എടുക്കാൻ അവതാറിൽ ക്ലിക്ക് ചെയ്യുക
              </span>
            </div>
            <button
              type="button"
              onClick={randomizeNames}
              className="flex items-center gap-1 text-xs text-amber-700 font-bold px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 hover:bg-amber-100 active:scale-95 transition-all shadow-sm"
            >
              <Shuffle className="w-3.5 h-3.5 text-amber-600" />
              <span>റാൻഡം 🎲</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {players.map((player, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-2.5 bg-slate-50/90 hover:bg-slate-50 rounded-2xl border border-slate-200/80 transition-all shadow-sm"
              >
                {/* Avatar with Camera Overlay */}
                <div
                  onClick={() => {
                    playClick();
                    setEditingPlayerIndex(index);
                  }}
                  className="relative cursor-pointer group"
                  title="ഫോട്ടോ എടുക്കുക അല്ലെങ്കിൽ മാറ്റുക"
                >
                  <PlayerAvatar
                    avatar={player.avatar}
                    photoUrl={player.photoUrl}
                    name={player.name}
                    size="sm"
                    className="group-hover:scale-105 transition-transform"
                    borderClassName="border-2 border-emerald-500 shadow"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-600 text-white rounded-full shadow-md group-hover:bg-emerald-700 transition-colors">
                    <Camera className="w-2.5 h-2.5" />
                  </div>
                </div>

                {/* Editable Name Field */}
                <div className="flex-1 flex items-center justify-between bg-white rounded-xl border border-slate-200 px-3 py-1.5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
                  <input
                    type="text"
                    maxLength={16}
                    value={player.name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    placeholder={`കളിക്കാരൻ ${index + 1}`}
                    className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none placeholder-slate-400 font-malayalam"
                  />
                  <Edit3 className="w-3.5 h-3.5 text-slate-300 ml-1 flex-shrink-0" />
                </div>

                {/* Quick Camera Trigger Button */}
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setEditingPlayerIndex(index);
                  }}
                  className="p-2 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-200"
                  aria-label="Take Photo"
                  title="ക്യാമറ ഫോട്ടോ"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Imposter Count */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-md shadow-slate-200/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <UserX className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-800 text-sm font-malayalam">
                Imposter എണ്ണം
              </span>
            </div>
            <span className="text-base font-black text-rose-600 px-3 py-0.5 bg-rose-50 rounded-xl border border-rose-200">
              {imposterCount} Imposter 😈
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((num) => {
              const disabled = num > maxImposters;
              const isSelected = imposterCount === num;
              return (
                <button
                  key={num}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    playClick();
                    setImposterCount(num);
                  }}
                  className={`py-2.5 rounded-2xl font-bold text-xs transition-all border ${
                    isSelected
                      ? 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/30'
                      : disabled
                      ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {num} Imposter
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-md shadow-slate-200/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-800 text-sm font-malayalam">
              വാക്കുകളുടെ കാഠിന്യം
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'all', label: 'എല്ലാം' },
              { id: 'easy', label: 'എളുപ്പം' },
              { id: 'medium', label: 'മീഡിയം' },
              { id: 'hard', label: 'കടുപ്പം' },
            ].map((diff) => {
              const isSelected = difficulty === diff.id;
              return (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => {
                    playClick();
                    setDifficulty(diff.id as typeof difficulty);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold font-malayalam transition-all border ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {diff.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-md shadow-slate-200/50">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-slate-800 text-sm font-malayalam">
              വിഭാഗങ്ങൾ (Categories)
            </span>
            <button
              type="button"
              onClick={() => toggleCategory('all')}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                selectedCategories.includes('all')
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              എല്ലാം മിക്സ് ✨
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected =
                selectedCategories.includes('all') || selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all border ${
                    isSelected
                      ? 'bg-gradient-to-tr from-emerald-50 to-teal-50 text-emerald-900 border-emerald-400 shadow-sm'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xl mb-1">{cat.icon}</span>
                  <span className="text-xs font-bold font-malayalam truncate max-w-full">
                    {cat.name_ml}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98] text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all font-malayalam"
          >
            <span>കളി തുടങ്ങാം! രഹസ്യങ്ങൾ അറിയാം</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Camera / Photo Capture Modal */}
      {editingPlayer && (
        <CameraPhotoModal
          isOpen={editingPlayerIndex !== null}
          playerName={editingPlayer.name}
          currentAvatar={editingPlayer.avatar}
          currentPhotoUrl={editingPlayer.photoUrl}
          onSave={handleAvatarOrPhotoChange}
          onClose={() => setEditingPlayerIndex(null)}
        />
      )}
    </div>
  );
};
