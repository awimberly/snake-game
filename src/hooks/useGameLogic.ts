import { useState, useCallback } from 'react';
import { Position, Direction, GameState, GameLogicReturn } from '../types';
import { GRID_SIZE } from '../constants';

export const useGameLogic = (initialSpeed: number, playSound: (type: 'eat' | 'crash') => void): GameLogicReturn => {
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    direction: 'RIGHT',
    gameOver: false,
    score: 0,
    isPaused: false,
    isStarted: false,
  });

  const generateFood = useCallback((): Position => {
    const availablePositions: Position[] = [];
    
    // Generate all possible positions
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        // Check if this position is occupied by the snake
        const isSnakeBody = gameState.snake.some(
          segment => segment.x === x && segment.y === y
        );
        
        if (!isSnakeBody) {
          availablePositions.push({ x, y });
        }
      }
    }
    
    // Randomly select one of the available positions
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    return availablePositions[randomIndex];
  }, [gameState.snake]);

  const moveSnake = useCallback((direction?: Direction) => {
    if (!gameState.isStarted) return;
    if (direction) {
      // Handle direction change
      const opposites = {
        UP: 'DOWN',
        DOWN: 'UP',
        LEFT: 'RIGHT',
        RIGHT: 'LEFT'
      };

      if (opposites[direction] !== gameState.direction) {
        setGameState(prev => ({ ...prev, direction }));
      }
      return;
    }
    if (gameState.gameOver || gameState.isPaused) return;

    const newSnake = [...gameState.snake];
    const head = { ...newSnake[0] };

    switch (gameState.direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
    }

    // Check collision with walls
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      playSound('crash');
      setGameState(prev => ({ ...prev, gameOver: true }));
      return;
    }

    // Check collision with self
    if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
      playSound('crash');
      setGameState(prev => ({ ...prev, gameOver: true }));
      return;
    }

    newSnake.unshift(head);

    // Check if food is eaten
    const hasEatenFood = head.x === gameState.food.x && head.y === gameState.food.y;
    if (hasEatenFood) {
      playSound('eat');
      const newScore = gameState.score + 1;
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('snakeHighScore', newScore.toString());
      }
      setGameState(prev => ({
        ...prev,
        food: generateFood(),
        score: prev.score + 1
      }));
    } else {
      newSnake.pop();
    }

    setGameState(prev => ({
      ...prev,
      snake: newSnake
    }));
  }, [gameState, generateFood, highScore, playSound]);

  const togglePause = () => {
    if (!gameState.isStarted || gameState.gameOver) return;
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      isStarted: true,
      isPaused: false,
      gameOver: false
    }));
  };

  const resetGame = () => {
    setGameState({
      isStarted: false,
      snake: [{ x: 10, y: 10 }],
      food: generateFood(),
      direction: 'RIGHT',
      gameOver: false,
      score: 0,
      isPaused: false
    });
  };

  return {
    snake: gameState.snake,
    food: gameState.food,
    score: gameState.score,
    highScore,
    isPaused: gameState.isPaused,
    isGameOver: gameState.gameOver,
    isStarted: gameState.isStarted,
    moveSnake: (direction?: Direction) => {
      if (direction) {
        moveSnake(direction);
      } else {
        moveSnake();
      }
    },
    resetGame,
    togglePause,
    startGame,
  };
};
