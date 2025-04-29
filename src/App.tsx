import React, { useEffect } from 'react';
import { GameBoard } from './components/GameBoard';
import { GameControls } from './components/GameControls';

import { useGameLogic } from './hooks/useGameLogic';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useSwipeControls } from './hooks/useSwipeControls';
import { useMobileDetect } from './hooks/useMobileDetect';
import { INITIAL_SPEED } from './constants';
import { useTheme } from './hooks/useTheme';
import { useSound } from './hooks/useSound';
import './styles/global.scss';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { isSoundEnabled, toggleSound, playSound } = useSound();
  const isMobile = useMobileDetect();
  const { snake, food, score, highScore, isPaused, isGameOver, isStarted, moveSnake, resetGame, togglePause, startGame } =
    useGameLogic(INITIAL_SPEED, playSound);

  useKeyboardControls(moveSnake, togglePause, isGameOver, isStarted, startGame);
  useSwipeControls(moveSnake, isMobile && isStarted);

  useEffect(() => {
    if (!isGameOver && !isPaused) {
      const gameLoop = setInterval(moveSnake, INITIAL_SPEED);
      return () => clearInterval(gameLoop);
    }
  }, [moveSnake, isGameOver, isPaused]);

  return (
    <div className="app">
      <div className="container">
        <div className="game-header">
          <div className="game-header__scores">
            <div className="score-item">
              <span className="score-icon" role="img" aria-hidden="true">🎯</span>
              <span className="sr-only">Current Score:</span> {score}
            </div>
            <div className="score-item">
              <span className="score-icon" role="img" aria-hidden="true">👑</span>
              <span className="sr-only">High Score:</span> {highScore}
            </div>
          </div>
        </div>

        <div className="game-container">
          <GameBoard 
            snake={snake}
            food={food}
            isPaused={isPaused}
            theme={theme}
          />
          
          <GameControls 
            score={score} 
            onReset={resetGame} 
            isPaused={isPaused}
            isGameOver={isGameOver}
            onPauseToggle={togglePause}
            theme={theme}
            onStartGame={startGame}
            isStarted={isStarted}
            onThemeToggle={toggleTheme}
            onSoundToggle={toggleSound}
            isSoundEnabled={isSoundEnabled}
          />

          <div className="controls-help" aria-label="Game Controls Instructions">
            {!isMobile ? (
              <div className="controls-help__text">
                <div>Use <span className="control-icon" role="img" aria-hidden="true">⌨️</span> arrow keys or WASD to move</div>
                <div>Press Space or P to start/pause <span className="control-icon" role="img" aria-hidden="true">⏸️</span></div>
              </div>
            ) : (
              <div className="controls-help__text">
                <div>Swipe <span className="control-icon" role="img" aria-hidden="true">👆</span> to move</div>
                <div>Tap to start/pause <span className="control-icon" role="img" aria-hidden="true">⏸️</span></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
