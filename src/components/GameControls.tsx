import React from 'react';
import { Theme, getColors } from '../constants';

interface GameControlsProps {
  theme: Theme;
  onThemeToggle: () => void;
  score: number;
  isPaused: boolean;
  isGameOver: boolean;
  onPauseToggle: () => void;
  onReset: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  theme,
  onThemeToggle,
  score,
  isPaused,
  isGameOver,
  onPauseToggle,
  onReset
}) => {
  const COLORS = getColors(theme);

  const buttonStyle = {
    padding: '8px 16px',
    fontSize: '1rem',
    backgroundColor: COLORS.BUTTON.BACKGROUND,
    color: COLORS.BUTTON.TEXT,
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  };

  return (
    <div
      className="game-controls"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        color: COLORS.TEXT
      }}
    >
      <div
        style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: COLORS.TEXT,
          marginBottom: '10px'
        }}
      >
        Score: {score}
      </div>
      {isGameOver && (
        <div
          style={{
            fontSize: '1.5rem',
            color: COLORS.TEXT,
            marginBottom: '10px'
          }}
        >
          Game Over!
        </div>
      )}
      <div style={{ display: 'flex', gap: '8px' }}>
        {!isGameOver && (
          <button
            onClick={(e) => {
              onPauseToggle();
              (e.target as HTMLElement).blur();
            }}
            style={buttonStyle}
            aria-label={isPaused ? 'Resume game' : 'Pause game'}
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>
        )}
        <button
          onClick={(e) => {
            onReset();
            (e.target as HTMLElement).blur();
          }}
          style={buttonStyle}
          aria-label="Start new game"
        >
          {isGameOver ? '🔄 Play Again' : 'Reset'}
        </button>
        <button
          onClick={(e) => {
            onThemeToggle();
            (e.target as HTMLElement).blur();
          }}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
      <div 
        className="controls-help" 
        role="complementary"
        style={{
          color: COLORS.TEXT,
          textAlign: 'center',
          marginTop: '1rem',
          display: window.innerWidth <= 768 ? 'none' : 'block'
        }}
      >
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Controls</h3>
        <p style={{ margin: '0.25rem 0' }}>Use arrow keys or WASD to move</p>
        <p style={{ margin: '0.25rem 0' }}>Press Space to pause</p>
      </div>
    </div>
  );
};
