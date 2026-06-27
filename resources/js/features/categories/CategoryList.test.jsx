import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
vi.mock('../../lib/api', () => ({ categories: { list: vi.fn() } }));
import { categories } from '../../lib/api';
import CategoryList from './CategoryList';

test('lists categories', async () => {
  categories.list.mockResolvedValue({ data: [{ id: 1, name: 'Work' }, { id: 2, name: 'Health' }] });
  render(<MemoryRouter><CategoryList /></MemoryRouter>);
  expect(await screen.findByText('Work')).toBeInTheDocument();
  expect(screen.getByText('Health')).toBeInTheDocument();
});
