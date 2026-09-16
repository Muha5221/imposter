import { Player, GameConfig, WordItem, GameState } from '../types/game';
import { pickRandomWord } from '../data/words';
import { FUN_AVATARS } from '../data/defaultNames';

export interface PlayerSetupInput {
  name: string;
  avatar: string;
  photoUrl?: string;
}

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createNewGame(
  playerInputs: (string | PlayerSetupInput)[],
  config: GameConfig,
  currentRound: number = 1,
  existingPlayers: Player[] = []
): Partial<GameState> {
  const count = playerInputs.length;
  const imposterCount = Math.min(Math.max(1, config.imposterCount), Math.max(1, count - 1));

  // Pick imposter indices randomly
  const indices = Array.from({ length: count }, (_, i) => i);
  const shuffledIndices = shuffleArray(indices);
  const imposterIndices = new Set(shuffledIndices.slice(0, imposterCount));

  // Pick secret word
  const secretWord = pickRandomWord(config.selectedCategories, config.difficulty);

  // Build players
  const players: Player[] = playerInputs.map((input, index) => {
    const isObject = typeof input !== 'string';
    const name = (isObject ? input.name : input).trim() || `പ്ലെയർ ${index + 1}`;
    
    // Preserve existing score if replay
    const existing = existingPlayers.find(
      p => p.name.trim().toLowerCase() === name.toLowerCase()
    );
    const avatar = isObject ? input.avatar : existing?.avatar || FUN_AVATARS[index % FUN_AVATARS.length];
    const photoUrl = isObject ? input.photoUrl : existing?.photoUrl;
    const score = existing?.score || 0;

    return {
      id: `p_${index + 1}_${Date.now()}`,
      name,
      isImposter: imposterIndices.has(index),
      hasViewedRole: false,
      avatar,
      photoUrl,
      score,
    };
  });

  // Pick starter speaker randomly
  const starterSpeaker = players[Math.floor(Math.random() * players.length)].name;

  return {
    phase: 'pass_phone',
    players,
    currentPlayerIndex: 0,
    secretWord,
    roundNumber: currentRound,
    starterSpeaker,
    votedPlayerId: null,
    votes: {},
    winner: null,
  };
}

export function determineGameResult(
  players: Player[],
  votedPlayerId: string | null
): { winner: 'crewmates' | 'imposters'; isVotedImposter: boolean } {
  if (!votedPlayerId) {
    return { winner: 'imposters', isVotedImposter: false };
  }

  const votedPlayer = players.find(p => p.id === votedPlayerId);
  if (votedPlayer && votedPlayer.isImposter) {
    return { winner: 'crewmates', isVotedImposter: true };
  } else {
    return { winner: 'imposters', isVotedImposter: false };
  }
}
