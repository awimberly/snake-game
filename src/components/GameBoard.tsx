import React from 'react';
import { Position } from '../types';
import { GRID_SIZE, CELL_SIZE, Theme } from '../constants';
import '../styles/global.scss';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  isPaused: boolean;
  theme: Theme;
}

export const GameBoard: React.FC<GameBoardProps> = ({ snake, food, isPaused, theme }) => {
  const boardStyle = {
    gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
    gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
    gap: '1px',
  };

  return (
    <div className="game-board" style={boardStyle}>
      {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
        const x = index % GRID_SIZE;
        const y = Math.floor(index / GRID_SIZE);
        const renderCell = (rowIndex: number, colIndex: number) => {
          const position = { x: colIndex, y: rowIndex };
          const isSnake = snake.some(segment => segment.x === position.x && segment.y === position.y);
          const isSnakeHead = snake[0].x === position.x && snake[0].y === position.y;
          const isFood = food.x === position.x && food.y === position.y;

          const cellClass = `game-board__cell ${isSnake ? 'game-board__cell--snake' : ''} ${isFood ? 'game-board__cell--food' : ''}`;

          return (
            <div 
              key={`${rowIndex}-${colIndex}`} 
              className={cellClass}
              data-is-head={isSnakeHead}
              aria-label={isFood ? 'Apple' : isSnakeHead ? 'Snake head' : isSnake ? 'Snake body' : 'Empty cell'}
              role="img"
            />
          );
        };
        return renderCell(y, x);
      })}
    </div>
  );
};
