import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

test('renders label and fires onClick', async () => {
  const onClick = vi.fn();
  render(<Button onClick={onClick}>Save task</Button>);
  await userEvent.click(screen.getByRole('button', { name: 'Save task' }));
  expect(onClick).toHaveBeenCalledOnce();
});

test('applies the danger variant styles', () => {
  render(<Button variant="danger">Delete</Button>);
  expect(screen.getByRole('button', { name: 'Delete' }).className).toContain('text-ember-low');
});
