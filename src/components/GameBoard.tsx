import React from 'react';
import { Position } from '../types';
import { GRID_SIZE, CELL_SIZE, Theme, getColors } from '../constants';

const getSnakeSegmentRotation = (x: number, y: number, snake: Position[]): number => {
  const index = snake.findIndex(segment => segment.x === x && segment.y === y);
  if (index === -1) return 0;

  // If it's the head, determine rotation based on next segment
  if (index === 0 && snake.length > 1) {
    const next = snake[1];
    if (next.y < y) return 0;      // facing up
    if (next.y > y) return 180;    // facing down
    if (next.x < x) return 270;    // facing left
    if (next.x > x) return 90;     // facing right
  }
  
  // If it's a body segment, determine rotation based on neighbors
  if (index > 0 && index < snake.length - 1) {
    const prev = snake[index - 1];
    const next = snake[index + 1];
    
    // Vertical segment
    if (prev.x === next.x) return 0;
    // Horizontal segment
    if (prev.y === next.y) return 90;
    // Corner segments
    if ((prev.x < x && next.y < y) || (next.x < x && prev.y < y)) return 0;
    if ((prev.x < x && next.y > y) || (next.x < x && prev.y > y)) return 270;
    if ((prev.x > x && next.y < y) || (next.x > x && prev.y < y)) return 90;
    if ((prev.x > x && next.y > y) || (next.x > x && prev.y > y)) return 180;
  }

  return 0;
};

interface GameBoardProps {
  snake: Position[];
  food: Position;
  isPaused: boolean;
  theme: Theme;
}

export const GameBoard: React.FC<GameBoardProps> = ({ snake, food, isPaused, theme }) => {
  const COLORS = getColors(theme);
  return (
    <div
      className="game-board"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
        gap: '1px',
        backgroundColor: COLORS.GRID,
        padding: '10px',
        borderRadius: '8px',
        position: 'relative'
      }}
      role="grid"
      aria-label="Snake game board"
    >
      {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
        const x = index % GRID_SIZE;
        const y = Math.floor(index / GRID_SIZE);
        const isSnakeHead = snake[0].x === x && snake[0].y === y;
        const isSnakeBody = snake.slice(1).some(
          segment => segment.x === x && segment.y === y
        );
        const isFood = food.x === x && food.y === y;

        return (
          <div
            key={index}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: COLORS.BACKGROUND,
              borderRadius: '4px',
              transition: 'all 0.1s ease',
              position: 'relative',
              filter: isPaused ? 'brightness(0.7)' : 'none'
            }}
            role={isFood ? 'img' : 'presentation'}
            aria-label={isFood ? 'Apple' : undefined}
          >
            {(isSnakeHead || isSnakeBody) && (
              <div
                style={{
                  position: 'absolute',
                  top: '2px',
                  left: '2px',
                  right: '2px',
                  bottom: '2px',
                  backgroundColor: isSnakeHead ? COLORS.SNAKE_HEAD : COLORS.SNAKE_BODY,
                  borderRadius: isSnakeHead ? '8px' : '4px',
                  border: `2px solid ${COLORS.SNAKE_BORDER}`,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  transform: `rotate(${getSnakeSegmentRotation(x, y, snake)}deg)`,
                  zIndex: isSnakeHead ? 2 : 1
                }}
              >
                {isSnakeHead && (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        top: '2px',
                        left: '2px',
                        width: '4px',
                        height: '4px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        boxShadow: '0 0 2px rgba(0,0,0,0.5)'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        width: '4px',
                        height: '4px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        boxShadow: '0 0 2px rgba(0,0,0,0.5)'
                      }}
                    />
                  </>
                )}
              </div>
            )}
            {isFood && (
              <div
                style={{
                  position: 'absolute',
                  top: '2px',
                  left: '2px',
                  right: '2px',
                  bottom: '2px',
                  backgroundColor: COLORS.FOOD,
                  borderRadius: '50%',
                  border: `2px solid ${COLORS.FOOD_BORDER}`,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  zIndex: 1
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    left: '50%',
                    width: '6px',
                    height: '8px',
                    backgroundColor: '#2F4F4F',
                    transform: 'translateX(-50%) rotate(-30deg)',
                    borderRadius: '2px 2px 0 0'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '6px',
                    height: '6px',
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    borderRadius: '50%'
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
