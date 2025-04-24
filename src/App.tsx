import React, { useEffect } from 'react';
import { GameBoard } from './components/GameBoard';
import { GameControls } from './components/GameControls';

import { useGameLogic } from './hooks/useGameLogic';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { getColors, INITIAL_SPEED } from './constants';
import { useTheme } from './hooks/useTheme';
import './App.css';

export const App = () => {
  const { theme, toggleTheme } = useTheme();
  const COLORS = getColors(theme);
  const { gameState, moveSnake, resetGame, togglePause, changeDirection } = useGameLogic();

  useKeyboardControls(changeDirection, togglePause, gameState.gameOver);

  useEffect(() => {
    if (!gameState.gameOver && !gameState.isPaused) {
      const gameLoop = setInterval(moveSnake, INITIAL_SPEED);
      return () => clearInterval(gameLoop);
    }
  }, [moveSnake, gameState.gameOver, gameState.isPaused]);

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
          snake={gameState.snake}
          food={gameState.food}
          isPaused={gameState.isPaused}
          theme={theme}
        />
        <div className="game-controls">
          <GameControls 
            score={gameState.score} 
            onReset={resetGame} 
            isPaused={gameState.isPaused}
            isGameOver={gameState.gameOver}
            onPauseToggle={togglePause}
            theme={theme}
            onThemeToggle={toggleTheme}
          />

        </div>
      </div>
    </div>
  );
}

export default App;
