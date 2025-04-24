import { useState, useCallback } from 'react';
import { Position, Direction, GameState } from '../types';
import { GRID_SIZE } from '../constants';

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    direction: 'RIGHT',
    gameOver: false,
    score: 0,
    isPaused: false
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

  const moveSnake = useCallback(() => {
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
      setGameState(prev => ({ ...prev, gameOver: true }));
      return;
    }

    // Check collision with self
    if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setGameState(prev => ({ ...prev, gameOver: true }));
      return;
    }

    newSnake.unshift(head);

    // Check if food is eaten
    if (head.x === gameState.food.x && head.y === gameState.food.y) {
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
  }, [gameState, generateFood]);

  const togglePause = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const resetGame = () => {
    setGameState({
      snake: [{ x: 10, y: 10 }],
      food: generateFood(),
      direction: 'RIGHT',
      gameOver: false,
      score: 0,
      isPaused: false
    });
  };

  const changeDirection = (newDirection: Direction) => {
    const opposites = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT'
    };

    if (opposites[newDirection] !== gameState.direction) {
      setGameState(prev => ({ ...prev, direction: newDirection }));
    }
  };

  return {
    gameState,
    moveSnake,
    resetGame,
    togglePause,
    changeDirection
  };
};
