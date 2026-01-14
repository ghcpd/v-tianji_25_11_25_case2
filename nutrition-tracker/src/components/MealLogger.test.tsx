import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test/test-utils';
import { MealLogger } from './MealLogger';

describe('MealLogger', () => {
  it('should render the meal logger form', () => {
    render(<MealLogger />);

    expect(screen.getByText('Log a Meal')).toBeInTheDocument();
    expect(screen.getByLabelText(/meal name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/calories/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/protein/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/carbs/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fat/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add meal/i })).toBeInTheDocument();
  });

  it('should render meal type buttons', () => {
    render(<MealLogger />);

    expect(screen.getByText('Breakfast')).toBeInTheDocument();
    expect(screen.getByText('Lunch')).toBeInTheDocument();
    expect(screen.getByText('Dinner')).toBeInTheDocument();
    expect(screen.getByText('Snack')).toBeInTheDocument();
  });

  it('should allow selecting meal type', async () => {
    const user = userEvent.setup();
    render(<MealLogger />);

    const lunchButton = screen.getByText('Lunch').closest('button');
    expect(lunchButton).toBeInTheDocument();

    await user.click(lunchButton!);

    expect(lunchButton).toHaveClass('border-emerald-500');
  });

  it('should submit the form and show success message', async () => {
    const user = userEvent.setup();
    render(<MealLogger />);

    await user.type(screen.getByLabelText(/meal name/i), 'Test Meal');
    await user.type(screen.getByLabelText(/calories/i), '500');
    await user.type(screen.getByLabelText(/protein/i), '30');
    await user.type(screen.getByLabelText(/carbs/i), '50');
    await user.type(screen.getByLabelText(/fat/i), '20');

    const submitButton = screen.getByRole('button', { name: /add meal/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/meal added successfully/i)).toBeInTheDocument();
    });
  });

  it('should clear form after submission', async () => {
    const user = userEvent.setup();
    render(<MealLogger />);

    const nameInput = screen.getByLabelText(/meal name/i) as HTMLInputElement;
    const caloriesInput = screen.getByLabelText(/calories/i) as HTMLInputElement;

    await user.type(nameInput, 'Test Meal');
    await user.type(caloriesInput, '500');

    const submitButton = screen.getByRole('button', { name: /add meal/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(nameInput.value).toBe('');
      expect(caloriesInput.value).toBe('');
    });
  });

  it('should require meal name and calories', () => {
    render(<MealLogger />);

    const nameInput = screen.getByLabelText(/meal name/i);
    const caloriesInput = screen.getByLabelText(/calories/i);

    expect(nameInput).toBeRequired();
    expect(caloriesInput).toBeRequired();
  });
});
