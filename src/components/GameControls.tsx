import React from 'react';
import '../styles/global.scss';
import { Theme } from '../constants';

interface GameControlsProps {
  theme: Theme;
  score: number;
  isPaused: boolean;
  isGameOver: boolean;
  onPauseToggle: () => void;
  onStartGame: () => void;
  isStarted: boolean;
  onReset: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  theme,
  score,
  isPaused,
  isGameOver,
  onPauseToggle,
  onStartGame,
  isStarted,
  onReset
}) => {

  return (
    <div className="game-controls">
      {isGameOver && (
        <div className="game-controls__game-over">
          Game Over!
        </div>
      )}
      <div className="game-controls__buttons">
        {!isStarted && !isGameOver ? (
          <button
            onClick={(e) => {
              onStartGame();
              (e.target as HTMLElement).blur();
            }}
            className="game-controls__button"
            aria-label="Start game"
          >
            ▶️ Play
          </button>
        ) : !isGameOver ? (
          <button
            onClick={(e) => {
              onPauseToggle();
              (e.target as HTMLElement).blur();
            }}
            className="game-controls__button"
            aria-label={isPaused ? 'Resume game' : 'Pause game'}
          >
            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
        ) : null}
        <button
          onClick={(e) => {
            onReset();
            (e.target as HTMLElement).blur();
          }}
          className="game-controls__button"
          aria-label="Start new game"
        >
          {isGameOver ? '🔄 Play Again' : '🔄 Reset'}
        </button>

      </div>

    </div>
  );
};
