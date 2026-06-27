import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('../../lib/api', () => ({
  tasks: { list: vi.fn(), remove: vi.fn() },
}));
vi.mock('react-toastify', () => ({ toast: { success: vi.fn(), error: vi.fn(), promise: vi.fn() } }));

import { tasks } from '../../lib/api';
import TaskList from './TaskList';

const sample = (over = {}) => ({
  id: 1, title: 'Q2 Sprint Planning', body: 'Prepare backlog', expires_at: null,
  category: { id: 1, name: 'Work' }, ...over,
});

function renderList() {
  return render(<MemoryRouter><TaskList /></MemoryRouter>);
}

test('shows a spinner then renders tasks', async () => {
  tasks.list.mockResolvedValue({ data: [sample()], meta: { current_page: 1, last_page: 1 } });
  renderList();
  expect(screen.getByRole('status')).toBeInTheDocument();
  expect(await screen.findByText('Q2 Sprint Planning')).toBeInTheDocument();
});

test('shows the empty state when there are no tasks', async () => {
  tasks.list.mockResolvedValue({ data: [], meta: { current_page: 1, last_page: 1 } });
  renderList();
  expect(await screen.findByText(/nothing on today/i)).toBeInTheDocument();
});
