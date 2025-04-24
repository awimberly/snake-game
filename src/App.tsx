import React, { useEffect } from 'react';
import { GameBoard } from './components/GameBoard';
import { GameControls } from './components/GameControls';

import { useGameLogic } from './hooks/useGameLogic';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { getColors, INITIAL_SPEED } from './constants';
import { useTheme } from './hooks/useTheme';
import { useSound } from './hooks/useSound';
import './App.css';

export const App = () => {
  const { theme, toggleTheme } = useTheme();
  const { isSoundEnabled, toggleSound, playSound } = useSound();
  const COLORS = getColors(theme);
  const { snake, food, score, isPaused, isGameOver, moveSnake, resetGame, togglePause } =
    useGameLogic(INITIAL_SPEED, playSound);

  useKeyboardControls(moveSnake, togglePause, isGameOver);

  useEffect(() => {
    if (!isGameOver && !isPaused) {
      const gameLoop = setInterval(moveSnake, INITIAL_SPEED);
      return () => clearInterval(gameLoop);
    }
  }, [moveSnake, isGameOver, isPaused]);

  return (
    <div
      className="App"
      style={{
        backgroundColor: COLORS.BACKGROUND,
      }}
    >
      <h1
        style={{
          color: COLORS.TEXT,
          margin: 0,
          padding: '20px 0',
          fontSize: '1.8rem',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        Snake Game
      </h1>
      <div className="game-container">
        <GameBoard
          snake={snake}
          food={food}
          isPaused={isPaused}
          theme={theme}
        />
        <div className="game-controls">
          <GameControls 
            score={score} 
            onReset={resetGame} 
            isPaused={isPaused}
            isGameOver={isGameOver}
            onPauseToggle={togglePause}
            theme={theme}
            onThemeToggle={toggleTheme}
            onSoundToggle={toggleSound}
            isSoundEnabled={isSoundEnabled}
          />

        </div>
      </div>
    </div>
  );
}

export default App;
