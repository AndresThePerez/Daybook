import { render, screen } from '@testing-library/react';
import Input from './Input';

test('shows the error and marks the field invalid', () => {
  render(<Input label="Title" id="title" error="The title is required." />);
  expect(screen.getByText('The title is required.')).toBeInTheDocument();
  expect(screen.getByLabelText('Title')).toHaveAttribute('aria-invalid', 'true');
});
