import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('../../lib/api', () => ({ tasks: { show: vi.fn() } }));
import { tasks } from '../../lib/api';
import TaskDetail from './TaskDetail';

test('renders the task once loaded', async () => {
  tasks.show.mockResolvedValue({ id: 3, title: 'Grocery Run', body: 'Eggs, milk', expires_at: null, category: { id: 3, name: 'Shopping' }, created_at: '2026-06-20T10:00:00Z' });
  render(<MemoryRouter initialEntries={['/tasks/3']}><Routes><Route path="/tasks/:id" element={<TaskDetail />} /></Routes></MemoryRouter>);
  expect(await screen.findByText('Grocery Run')).toBeInTheDocument();
  expect(screen.getByText('Eggs, milk')).toBeInTheDocument();
});
