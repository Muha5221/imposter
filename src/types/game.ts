export type CategoryId = 
  | 'food'
  | 'places'
  | 'movies'
  | 'sports'
  | 'animals'
  | 'games'
  | 'daily'
  | 'kerala'
  | 'fun';

export interface WordItem {
  id: string;
  word_ml: string;
  word_en: string;
  category: CategoryId;
  category_ml: string;
  image: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hint?: string;
}

export interface CategoryInfo {
  id: CategoryId;
  name_ml: string;
  name_en: string;
  icon: string;
  color: string;
  description_ml: string;
}

export interface Player {
  id: string;
  name: string;
  isImposter: boolean;
  hasViewedRole: boolean;
  avatar: string;
  photoUrl?: string;
  score: number;
}

export type GamePhase =
  | 'home'
  | 'setup'
  | 'pass_phone'
  | 'reveal_role'
  | 'all_ready'
  | 'discussion'
  | 'voting'
  | 'dramatic_reveal'
  | 'results';

export interface GameConfig {
  playerCount: number;
  imposterCount: number;
  difficulty: 'all' | 'easy' | 'medium' | 'hard';
  selectedCategories: (CategoryId | 'all')[];
  timerDuration: number; // in seconds, default 120
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  secretWord: WordItem | null;
  config: GameConfig;
  roundNumber: number;
  starterSpeaker: string | null;
  votedPlayerId: string | null;
  votes: Record<string, number>;
  winner: 'crewmates' | 'imposters' | null;
  soundEnabled: boolean;
  darkMode: boolean;
}
