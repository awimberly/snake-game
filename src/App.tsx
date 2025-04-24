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
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.BACKGROUND,
        padding: '20px'
      }}
    >
      <h1
        style={{
          color: COLORS.TEXT,
          fontSize: '2.5rem',
          marginBottom: '20px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        Snake Game
      </h1>
      <div
        className="game-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          alignItems: 'center'
        }}
      >
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
