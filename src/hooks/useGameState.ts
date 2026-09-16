import { useState, useEffect, useCallback } from 'react';
import { GameState, GameConfig, Player } from '../types/game';
import { createNewGame, determineGameResult, PlayerSetupInput } from '../utils/gameLogic';
import { setSoundMuted } from '../utils/audio';

const STORAGE_KEY = 'aara_imposter_game_state_v1';
const SOUND_KEY = 'aara_imposter_sound_v1';
const THEME_KEY = 'aara_imposter_theme_v1';

const DEFAULT_CONFIG: GameConfig = {
  playerCount: 4,
  imposterCount: 1,
  difficulty: 'all',
  selectedCategories: ['all'],
  timerDuration: 120, // 2 minutes
};

const INITIAL_STATE: GameState = {
  phase: 'home',
  players: [],
  currentPlayerIndex: 0,
  secretWord: null,
  config: DEFAULT_CONFIG,
  roundNumber: 1,
  starterSpeaker: null,
  votedPlayerId: null,
  votes: {},
  winner: null,
  soundEnabled: true,
  darkMode: false, // Default to user-friendly white / light background
};

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      // Default to false (light/white mode) unless user explicitly saved 'dark'
      const isDark = savedTheme === 'dark';
      const savedSound = localStorage.getItem(SOUND_KEY);
      const isSound = savedSound !== null ? savedSound === 'true' : true;

      // Check session storage for in-progress game
      const savedState = sessionStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.phase === 'reveal_role') {
          parsed.phase = 'pass_phone';
        }
        return {
          ...parsed,
          darkMode: isDark,
          soundEnabled: isSound,
        };
      }

      return {
        ...INITIAL_STATE,
        darkMode: isDark,
        soundEnabled: isSound,
      };
    } catch {
      return INITIAL_STATE;
    }
  });

  // Sync state to sessionStorage (without storing sensitive word in URL)
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage unavailable or quota exceeded
    }
  }, [state]);

  // Sync sound setting
  useEffect(() => {
    try {
      localStorage.setItem(SOUND_KEY, String(state.soundEnabled));
      setSoundMuted(!state.soundEnabled);
    } catch {
      // Storage unavailable
    }
  }, [state.soundEnabled]);

  // Sync dark mode setting to HTML root
  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, state.darkMode ? 'dark' : 'light');
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // Storage unavailable
    }
  }, [state.darkMode]);

  // Anti-accidental browser back button guard during pass-and-play
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (state.phase === 'reveal_role') {
        e.preventDefault();
        setState(prev => ({ ...prev, phase: 'pass_phone' }));
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [state.phase]);

  const toggleSound = useCallback(() => {
    setState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  }, []);

  const goToHome = useCallback(() => {
    setState(prev => ({ ...prev, phase: 'home' }));
  }, []);

  const goToSetup = useCallback(() => {
    setState(prev => ({ ...prev, phase: 'setup' }));
  }, []);

  const startGame = useCallback((playerInputs: (string | PlayerSetupInput)[], config: GameConfig) => {
    const newGameState = createNewGame(playerInputs, config, 1);
    setState(prev => ({
      ...prev,
      ...newGameState,
      config,
    }));
  }, []);

  const startRevealRole = useCallback(() => {
    window.history.pushState({ roleReveal: true }, '');
    setState(prev => ({
      ...prev,
      phase: 'reveal_role',
    }));
  }, []);

  const finishViewingRole = useCallback(() => {
    setState(prev => {
      const updatedPlayers = [...prev.players];
      if (updatedPlayers[prev.currentPlayerIndex]) {
        updatedPlayers[prev.currentPlayerIndex].hasViewedRole = true;
      }

      const nextIndex = prev.currentPlayerIndex + 1;

      if (nextIndex >= prev.players.length) {
        return {
          ...prev,
          players: updatedPlayers,
          phase: 'all_ready',
        };
      }

      return {
        ...prev,
        players: updatedPlayers,
        currentPlayerIndex: nextIndex,
        phase: 'pass_phone',
      };
    });
  }, []);

  const startDiscussion = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'discussion',
    }));
  }, []);

  const goToVoting = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'voting',
    }));
  }, []);

  const submitVote = useCallback((votedPlayerId: string) => {
    setState(prev => {
      const votes = { ...prev.votes };
      votes[votedPlayerId] = (votes[votedPlayerId] || 0) + 1;

      return {
        ...prev,
        votedPlayerId,
        votes,
        phase: 'dramatic_reveal',
      };
    });
  }, []);

  const completeDramaticReveal = useCallback(() => {
    setState(prev => {
      const { winner } = determineGameResult(prev.players, prev.votedPlayerId);
      
      const updatedPlayers = prev.players.map(p => {
        let addedScore = 0;
        if (winner === 'crewmates' && !p.isImposter) {
          addedScore = 100;
        } else if (winner === 'imposters' && p.isImposter) {
          addedScore = 200;
        }
        return {
          ...p,
          score: p.score + addedScore,
        };
      });

      return {
        ...prev,
        players: updatedPlayers,
        winner,
        phase: 'results',
      };
    });
  }, []);

  const playAgainSamePlayers = useCallback(() => {
    setState(prev => {
      const inputs: PlayerSetupInput[] = prev.players.map(p => ({
        name: p.name,
        avatar: p.avatar,
        photoUrl: p.photoUrl,
      }));
      const newGameState = createNewGame(inputs, prev.config, prev.roundNumber + 1, prev.players);
      return {
        ...prev,
        ...newGameState,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState(prev => ({
      ...INITIAL_STATE,
      soundEnabled: prev.soundEnabled,
      darkMode: prev.darkMode,
      phase: 'setup',
    }));
  }, []);

  return {
    state,
    toggleSound,
    toggleDarkMode,
    goToHome,
    goToSetup,
    startGame,
    startRevealRole,
    finishViewingRole,
    startDiscussion,
    goToVoting,
    submitVote,
    completeDramaticReveal,
    playAgainSamePlayers,
    resetGame,
  };
}
