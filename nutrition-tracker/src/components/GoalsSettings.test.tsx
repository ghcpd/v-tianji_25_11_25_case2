import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test/test-utils';
import { GoalsSettings } from './GoalsSettings';

describe('GoalsSettings', () => {
  it('should render goals settings', () => {
    render(<GoalsSettings />);

    expect(screen.getByText('Daily Goals')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('should display default calorie goal', () => {
    render(<GoalsSettings />);

    expect(screen.getByText('2000')).toBeInTheDocument();
    expect(screen.getByText('Daily Calories')).toBeInTheDocument();
  });

  it('should display default macro goals', () => {
    render(<GoalsSettings />);

    expect(screen.getByText('150g')).toBeInTheDocument(); // Protein
    expect(screen.getByText('250g')).toBeInTheDocument(); // Carbs
    expect(screen.getByText('65g')).toBeInTheDocument(); // Fat
  });

  it('should enter edit mode when Edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<GoalsSettings />);

    await user.click(screen.getByText('Edit'));

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('should show input fields in edit mode', async () => {
    const user = userEvent.setup();
    render(<GoalsSettings />);

    await user.click(screen.getByText('Edit'));

    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs.length).toBe(4); // Calories, Protein, Carbs, Fat
  });

  it('should cancel edit mode', async () => {
    const user = userEvent.setup();
    render(<GoalsSettings />);

    await user.click(screen.getByText('Edit'));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
  });

  it('should save new goals', async () => {
    const user = userEvent.setup();
    render(<GoalsSettings />);

    await user.click(screen.getByText('Edit'));

    const inputs = screen.getAllByRole('spinbutton');
    const caloriesInput = inputs[0];

    await user.clear(caloriesInput);
    await user.type(caloriesInput, '2500');

    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(screen.getByText(/goals updated successfully/i)).toBeInTheDocument();
    });

    expect(screen.getByText('2500')).toBeInTheDocument();
  });
});
