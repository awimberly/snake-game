import React from 'react';
import '../styles/global.scss';

interface GameControlsProps {
  score: number;
  onReset: () => void;
  isPaused: boolean;
  isGameOver: boolean;
  onPauseToggle: () => void;
  theme: string;
  onStartGame: () => void;
  isStarted: boolean;
  onThemeToggle: () => void;
  onSoundToggle: () => void;
  isSoundEnabled: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onReset,
  isPaused,
  isGameOver,
  onPauseToggle,
  onStartGame,
  isStarted,
  theme,
  onThemeToggle,
  onSoundToggle,
  isSoundEnabled,
}) => {
  const handleReset = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    onReset();
    if (!isStarted) {
      onStartGame();
    }
  };

  return (
    <div className="game-controls">
      <div className="game-controls__settings">
        <button
          onClick={onThemeToggle}
          onTouchStart={(e) => {
            e.preventDefault();
            onThemeToggle();
          }}
          className="control-button"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span role="img" aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
          <span className="sr-only">Toggle Theme</span>
        </button>
        <button
          onClick={onSoundToggle}
          onTouchStart={(e) => {
            e.preventDefault();
            onSoundToggle();
          }}
          className="control-button"
          aria-label={`${isSoundEnabled ? 'Mute' : 'Unmute'} sound`}
        >
          <span role="img" aria-hidden="true">{isSoundEnabled ? '🔊' : '🔇'}</span>
          <span className="sr-only">{isSoundEnabled ? 'Mute' : 'Unmute'} Sound</span>
        </button>
      </div>
      <div className="game-controls__buttons">
        {!isStarted && !isGameOver && (
          <button
            onClick={onStartGame}
            onTouchStart={(e) => {
              e.preventDefault();
              onStartGame();
            }}
            className="control-button"
            aria-label="Start Game"
          >
            <span role="img" aria-hidden="true">▶️</span>
            <span className="sr-only">Start</span>
          </button>
        )}

        {isStarted && !isGameOver && (
          <button
            onClick={onPauseToggle}
            onTouchStart={(e) => {
              e.preventDefault();
              onPauseToggle();
            }}
            className="control-button"
            aria-label={isPaused ? 'Resume Game' : 'Pause Game'}
          >
            <span role="img" aria-hidden="true">
              {isPaused ? '▶️' : '⏸️'}
            </span>
            <span className="sr-only">{isPaused ? 'Resume' : 'Pause'}</span>
          </button>
        )}

        {(isGameOver || isStarted) && (
          <button
            onClick={handleReset}
            onTouchStart={handleReset}
            className="control-button"
            aria-label="Reset Game"
          >
            <span role="img" aria-hidden="true">🔄</span>
            <span className="sr-only">Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
