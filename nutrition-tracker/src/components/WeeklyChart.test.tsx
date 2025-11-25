import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../test/test-utils';
import { WeeklyChart } from './WeeklyChart';

// Mock recharts to avoid rendering issues in tests
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Line: () => <div data-testid="line" />,
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ReferenceLine: () => <div data-testid="reference-line" />,
}));

describe('WeeklyChart', () => {
  it('should render the weekly chart section', () => {
    render(<WeeklyChart date="2025-01-15" />);

    expect(screen.getByText('Weekly Progress')).toBeInTheDocument();
  });

  it('should display stats cards', () => {
    render(<WeeklyChart date="2025-01-15" />);

    expect(screen.getByText('Total Calories')).toBeInTheDocument();
    expect(screen.getByText('Daily Average')).toBeInTheDocument();
    expect(screen.getByText('Days on Target')).toBeInTheDocument();
  });

  it('should show chart sections', () => {
    render(<WeeklyChart date="2025-01-15" />);

    expect(screen.getByText('Calorie Intake')).toBeInTheDocument();
    expect(screen.getByText('Macronutrients')).toBeInTheDocument();
  });

  it('should render charts', () => {
    render(<WeeklyChart date="2025-01-15" />);

    expect(screen.getAllByTestId('responsive-container')).toHaveLength(2);
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('should show 0/7 days on target initially', () => {
    render(<WeeklyChart date="2025-01-15" />);

    expect(screen.getByText('0/7')).toBeInTheDocument();
  });

  it('should show 0 total calories initially', () => {
    render(<WeeklyChart date="2025-01-15" />);

    // Multiple elements with '0' exist (total calories and daily average)
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements.length).toBeGreaterThan(0);
  });
});
