import { render, screen } from '@testing-library/react';
import App from './App';

test('renders státnice heading', () => {
  render(<App />);
  expect(screen.getByText(/Státnice Beneše/i)).toBeInTheDocument();
});
