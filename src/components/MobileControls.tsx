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
    width: '50px',
    height: '50px',
    border: `2px solid ${colors.buttonBackground}`,
    borderRadius: '12px',
    backgroundColor: colors.BUTTON.BACKGROUND,
    color: colors.BUTTON.TEXT,
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    touchAction: 'manipulation',
    padding: 0,
    margin: 0,
    transition: 'all 0.2s ease',
    WebkitTapHighlightColor: 'transparent',
  };

  const buttonContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    width: 'fit-content',
    margin: '0 auto',
    padding: '10px',
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
