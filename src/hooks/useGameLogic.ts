import { useState, useCallback } from 'react';
import { Position, Direction, GameState, GameLogicReturn } from '../types';
import { GRID_SIZE } from '../constants';

// Initial positions
const INITIAL_SNAKE_HEAD: Position = { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) };
const INITIAL_FOOD: Position = { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 4) };

// Create initial snake with length 3
const createInitialSnake = (): Position[] => [
  INITIAL_SNAKE_HEAD,
  { x: INITIAL_SNAKE_HEAD.x - 1, y: INITIAL_SNAKE_HEAD.y },
  { x: INITIAL_SNAKE_HEAD.x - 2, y: INITIAL_SNAKE_HEAD.y },
];

export const useGameLogic = (initialSpeed: number, playSound: (type: 'eat' | 'crash') => void): GameLogicReturn => {

  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [gameState, setGameState] = useState<GameState>({
    snake: createInitialSnake(),
    food: INITIAL_FOOD,
    direction: 'RIGHT',
    gameOver: false,
    score: 0,
    isPaused: false,
    isStarted: false,
  });

  const generateFood = useCallback((currentSnake: Position[]): Position => {
    // Create a list of all valid positions
    const validPositions: Position[] = [];
    
    // Create a Set of snake positions for O(1) lookup
    const snakeSet = new Set(
      currentSnake.map(pos => `${pos.x},${pos.y}`)
    );
    
    // Find all positions that aren't occupied by the snake
    // Keep food away from edges by 1 cell
    for (let y = 1; y < GRID_SIZE - 1; y++) {
      for (let x = 1; x < GRID_SIZE - 1; x++) {
        const posKey = `${x},${y}`;
        if (!snakeSet.has(posKey)) {
          validPositions.push({ x, y });
        }
      }
    }
    
    // If we have valid positions, pick one randomly
    if (validPositions.length > 0) {
      const randomIndex = Math.floor(Math.random() * validPositions.length);
      return validPositions[randomIndex];
    }
    
    // If no positions are available in the safe zone,
    // try the entire grid except edges
    for (let y = 1; y < GRID_SIZE - 1; y++) {
      for (let x = 1; x < GRID_SIZE - 1; x++) {
        if (x !== currentSnake[0].x || y !== currentSnake[0].y) {
          return { x, y };
        }
      }
    }
    
    // Ultimate fallback - center of the grid
    return { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) };
  }, []);

  const moveSnake = useCallback((direction?: Direction) => {
    if (!gameState.isStarted) return;

    // Handle direction change
    if (direction) {
      const opposites = {
        UP: 'DOWN',
        DOWN: 'UP',
        LEFT: 'RIGHT',
        RIGHT: 'LEFT'
      };

      // Prevent 180-degree turns
      if (opposites[direction] !== gameState.direction) {
        setGameState(prev => ({ ...prev, direction }));
      }
      return;
    }

    // Don't move if game is over or paused
    if (gameState.gameOver || gameState.isPaused) return;

    setGameState(prev => {
      // Calculate new head position first
      const head = { ...prev.snake[0] };
      const newHead = { ...head };

      switch (prev.direction) {
        case 'UP':
          newHead.y = head.y - 1;
          break;
        case 'DOWN':
          newHead.y = head.y + 1;
          break;
        case 'LEFT':
          newHead.x = head.x - 1;
          break;
        case 'RIGHT':
          newHead.x = head.x + 1;
          break;
      }

      // Check wall collision BEFORE moving snake
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        playSound('crash');
        return { ...prev, gameOver: true };
      }

      // Check self collision BEFORE moving snake
      if (prev.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        playSound('crash');
        return { ...prev, gameOver: true };
      }

      // If no collisions, create new snake array
      const newSnake = [newHead, ...prev.snake.slice(0, -1)];

      // Check if food is eaten
      const hasEatenFood = newHead.x === prev.food.x && newHead.y === prev.food.y;
      
      if (hasEatenFood) {
        playSound('eat');
        const newScore = prev.score + 1;
        
        // Update high score if needed
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('snakeHighScore', newScore.toString());
        }
        
        // When eating food, add new head without removing tail
        const growingSnake = [newHead, ...prev.snake];
        const newFood = generateFood(growingSnake);
        
        return {
          ...prev,
          snake: growingSnake,
          food: newFood,
          score: newScore
        };
      }
      
      return {
        ...prev,
        snake: newSnake
      };
    });
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
    const initialSnake = createInitialSnake();
    const initialFood = generateFood(initialSnake);
    const initialState: GameState = {
      isStarted: false,
      snake: initialSnake,
      food: initialFood,
      direction: 'RIGHT' as Direction,
      gameOver: false,
      score: 0,
      isPaused: false
    };
    setGameState(initialState);
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
