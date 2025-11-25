import type { ReactNode } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { NutritionProvider } from '../context/NutritionContext';

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return <NutritionProvider>{children}</NutritionProvider>;
};

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
