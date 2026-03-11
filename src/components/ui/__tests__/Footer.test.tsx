import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from '../Footer';

describe('Footer Component', () => {
  it('should render correctly', () => {
    render(<Footer />);
    expect(screen.getByText(/INFRALYZER - VERSION 1.0.0/)).toBeInTheDocument();
  });

  it('should contain the developer link', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: /DEVELOPED BY MATHEUSJFA/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://github.com/matheusjfa');
  });
});
