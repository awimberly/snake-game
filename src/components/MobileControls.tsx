import React from 'react';
import { Direction } from '../types';
import { getColors, Theme } from '../constants';

interface MobileControlsProps {
  onDirectionChange: (direction: Direction) => void;
  theme: Theme;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ onDirectionChange, theme }) => {
  const colors = getColors(theme);

  const buttonStyle = {
    width: '60px',
    height: '60px',
    border: 'none',
    borderRadius: '50%',
    backgroundColor: colors.BUTTON.BACKGROUND,
    color: colors.BUTTON.TEXT,
    fontSize: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    touchAction: 'manipulation',
    padding: 0,
    margin: 0,
    transition: 'all 0.2s ease',
    WebkitTapHighlightColor: 'transparent',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    userSelect: 'none' as const,
  };

  const buttonContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px',
    width: 'fit-content',
    margin: '0 auto',
    padding: '15px',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '20px',
  };

  return (
    <div className="mobile-controls">
      <div style={buttonContainerStyle}>
        {/* Top row */}
        <div></div>
        <button
          style={buttonStyle}
          onClick={() => onDirectionChange('UP')}
          aria-label="Move Up"
        >
          ↑
        </button>
        <div></div>

        {/* Middle row */}
        <button
          style={buttonStyle}
          onClick={() => onDirectionChange('LEFT')}
          aria-label="Move Left"
        >
          ←
        </button>
        <div></div>
        <button
          style={buttonStyle}
          onClick={() => onDirectionChange('RIGHT')}
          aria-label="Move Right"
        >
          →
        </button>

        {/* Bottom row */}
        <div></div>
        <button
          style={buttonStyle}
          onClick={() => onDirectionChange('DOWN')}
          aria-label="Move Down"
        >
          ↓
        </button>
        <div></div>
      </div>
    </div>
  );
};
