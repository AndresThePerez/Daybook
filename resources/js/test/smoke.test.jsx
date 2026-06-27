import { render, screen } from '@testing-library/react';

function Hello() { return <h1>Daybook</h1>; }

test('testing harness renders a component', () => {
  render(<Hello />);
  expect(screen.getByRole('heading', { name: 'Daybook' })).toBeInTheDocument();
});
