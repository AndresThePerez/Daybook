import { render, screen } from '@testing-library/react';
import TimeBar from './TimeBar';

const H = 3600 * 1000;
const NOW = 1_700_000_000_000;
const iso = (ms) => new Date(NOW + ms).toISOString();

test('renders the remaining label and a proportional fill', () => {
  const { container } = render(<TimeBar expiresAt={iso(6 * H)} now={NOW} />);
  expect(screen.getByText('6h 0m left')).toBeInTheDocument();
  expect(container.querySelector('[data-fill]')).toHaveStyle({ width: '50%' });
});

test('marks urgent tasks', () => {
  const { container } = render(<TimeBar expiresAt={iso(30 * 60 * 1000)} now={NOW} />);
  expect(container.querySelector('[data-fill]').className).toContain('ttl-fill-urgent');
});

test('renders nothing for a kept task', () => {
  const { container } = render(<TimeBar expiresAt={null} now={NOW} />);
  expect(container).toBeEmptyDOMElement();
});
