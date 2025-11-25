import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../test/test-utils';
import { DailySummary } from './DailySummary';

// Mock the date to have consistent tests
vi.mock('date-fns', async () => {
  const actual = await vi.importActual('date-fns');
  return {
    ...actual,
    format: (date: Date | string, formatStr: string) => {
      const actualFormat = (actual as { format: typeof import('date-fns').format }).format;
      if (typeof date === 'string') {
        return actualFormat(new Date(date), formatStr);
      }
      return actualFormat(date, formatStr);
    },
  };
});

describe('DailySummary', () => {
  it('should render the daily summary', () => {
    render(<DailySummary date="2025-01-15" />);

    expect(screen.getByText('Daily Summary')).toBeInTheDocument();
    expect(screen.getByText(/Today's Meals/i)).toBeInTheDocument();
  });

  it('should display calorie goal progress', () => {
    render(<DailySummary date="2025-01-15" />);

    // Default goal is 2000 calories
    expect(screen.getByText(/2000 cal/i)).toBeInTheDocument();
  });

  it('should show macros progress bars', () => {
    render(<DailySummary date="2025-01-15" />);

    expect(screen.getByText('Protein')).toBeInTheDocument();
    expect(screen.getByText('Carbs')).toBeInTheDocument();
    expect(screen.getByText('Fat')).toBeInTheDocument();
  });

  it('should show "No meals logged yet" when no meals', () => {
    render(<DailySummary date="2025-01-15" />);

    expect(screen.getByText('No meals logged yet')).toBeInTheDocument();
  });

  it('should display total calories as 0 initially', () => {
    render(<DailySummary date="2025-01-15" />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should display macro goals', () => {
    render(<DailySummary date="2025-01-15" />);

    // Default goals
    expect(screen.getByText(/0g \/ 150g/)).toBeInTheDocument(); // Protein
    expect(screen.getByText(/0g \/ 250g/)).toBeInTheDocument(); // Carbs
    expect(screen.getByText(/0g \/ 65g/)).toBeInTheDocument(); // Fat
  });
});
