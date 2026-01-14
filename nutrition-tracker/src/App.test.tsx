import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import App from './App';

// Mock recharts
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

describe('App', () => {
  it('should render the app header', () => {
    render(<App />);

    expect(screen.getByText('🥗 NutriTrack')).toBeInTheDocument();
  });

  it('should render navigation tabs', () => {
    render(<App />);

    expect(screen.getByText('Log Meal')).toBeInTheDocument();
    expect(screen.getByText('Daily')).toBeInTheDocument();
    expect(screen.getByText('Weekly')).toBeInTheDocument();
    expect(screen.getByText('Goals')).toBeInTheDocument();
  });

  it('should show MealLogger by default', () => {
    render(<App />);

    expect(screen.getByText('Log a Meal')).toBeInTheDocument();
  });

  it('should switch to Daily tab', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Daily'));

    await waitFor(() => {
      expect(screen.getByText('Daily Summary')).toBeInTheDocument();
    });
  });

  it('should switch to Weekly tab', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Weekly'));

    await waitFor(() => {
      expect(screen.getByText('Weekly Progress')).toBeInTheDocument();
    });
  });

  it('should switch to Goals tab', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Goals'));

    await waitFor(() => {
      expect(screen.getByText('Daily Goals')).toBeInTheDocument();
    });
  });

  it('should have a date picker', () => {
    render(<App />);

    const dateInputs = screen.getAllByDisplayValue(/\d{4}-\d{2}-\d{2}/);
    expect(dateInputs.length).toBeGreaterThan(0);
  });

  it('should have navigation arrows for date', () => {
    render(<App />);

    expect(screen.getByLabelText('Previous day')).toBeInTheDocument();
    expect(screen.getByLabelText('Next day')).toBeInTheDocument();
  });

  it('should render footer', () => {
    render(<App />);

    expect(screen.getByText(/NutriTrack ©/)).toBeInTheDocument();
  });

  it('should allow adding a meal and seeing it in daily view', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a meal
    await user.type(screen.getByLabelText(/meal name/i), 'Test Meal');
    await user.type(screen.getByLabelText(/calories/i), '500');

    await user.click(screen.getByRole('button', { name: /add meal/i }));

    // Switch to daily view
    await user.click(screen.getByText('Daily'));

    // Should see the meal
    await waitFor(() => {
      expect(screen.getByText('Test Meal')).toBeInTheDocument();
    });
  });
});
