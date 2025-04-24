import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('Snake Game', () => {
  test('renders game title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Snake Game/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders score display', () => {
    render(<App />);
    const scoreElement = screen.getByText(/Score: 0/i);
    expect(scoreElement).toBeInTheDocument();
  });

  test('renders game board', () => {
    render(<App />);
    const gameBoard = screen.getByRole('grid', { name: /snake game board/i });
    expect(gameBoard).toBeInTheDocument();
  });
});
