import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { Navbar } from './components/Navbar';
import { HowToPlayModal } from './components/HowToPlayModal';
import { HomeScreen } from './components/HomeScreen';
import { SetupScreen } from './components/SetupScreen';
import { PassPhoneScreen } from './components/PassPhoneScreen';
import { SwipeRevealCard } from './components/SwipeRevealCard';
import { AllReadyScreen } from './components/AllReadyScreen';
import { DiscussionScreen } from './components/DiscussionScreen';
import { VotingScreen } from './components/VotingScreen';
import { DramaticReveal } from './components/DramaticReveal';
import { ResultsScreen } from './components/ResultsScreen';

export const App: React.FC = () => {
  const {
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
  } = useGameState();

  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const inActiveGame =
    state.phase !== 'home' && state.phase !== 'setup' && state.players.length > 0;

  const currentPlayer = state.players[state.currentPlayerIndex];
  const isLastPlayer = state.currentPlayerIndex >= state.players.length - 1;
  const starterPlayer = state.players.find(p => p.name === state.starterSpeaker);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      {/* Universal Top Navigation */}
      <Navbar
        soundEnabled={state.soundEnabled}
        darkMode={state.darkMode}
        roundNumber={state.roundNumber}
        inGame={inActiveGame}
        onToggleSound={toggleSound}
        onToggleDarkMode={toggleDarkMode}
        onOpenRules={() => setIsRulesOpen(true)}
        onResetGame={goToSetup}
      />

      {/* Main Game Screen Router */}
      <main className="flex-1 flex flex-col justify-center">
        {state.phase === 'home' && (
          <HomeScreen
            onStartGame={goToSetup}
            onOpenRules={() => setIsRulesOpen(true)}
          />
        )}

        {state.phase === 'setup' && (
          <SetupScreen
            onBack={goToHome}
            onStartGame={startGame}
          />
        )}

        {state.phase === 'pass_phone' && currentPlayer && (
          <PassPhoneScreen
            player={currentPlayer}
            playerIndex={state.currentPlayerIndex}
            totalPlayers={state.players.length}
            onReadyToReveal={startRevealRole}
          />
        )}

        {state.phase === 'reveal_role' && currentPlayer && state.secretWord && (
          <SwipeRevealCard
            player={currentPlayer}
            secretWord={state.secretWord}
            isLastPlayer={isLastPlayer}
            onFinishedViewing={finishViewingRole}
          />
        )}

        {state.phase === 'all_ready' && (
          <AllReadyScreen onStartDiscussion={startDiscussion} />
        )}

        {state.phase === 'discussion' && (
          <DiscussionScreen
            initialDuration={state.config.timerDuration}
            starterSpeaker={state.starterSpeaker}
            starterPlayer={starterPlayer}
            onGoToVoting={goToVoting}
          />
        )}

        {state.phase === 'voting' && (
          <VotingScreen
            players={state.players}
            onBackToDiscussion={startDiscussion}
            onSubmitVote={submitVote}
          />
        )}

        {state.phase === 'dramatic_reveal' && state.votedPlayerId && state.secretWord && (
          <DramaticReveal
            players={state.players}
            votedPlayerId={state.votedPlayerId}
            secretWord={state.secretWord}
            onContinueToResults={completeDramaticReveal}
          />
        )}

        {state.phase === 'results' && state.secretWord && (
          <ResultsScreen
            winner={state.winner}
            players={state.players}
            secretWord={state.secretWord}
            onPlayAgain={playAgainSamePlayers}
            onNewGame={resetGame}
          />
        )}
      </main>

      {/* Rules & Guide Modal */}
      <HowToPlayModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />
    </div>
  );
};

export default App;
