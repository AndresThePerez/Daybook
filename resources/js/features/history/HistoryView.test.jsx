import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
vi.mock('../../lib/api', () => ({ tasks: { list: vi.fn() } }));
import { tasks } from '../../lib/api';
import HistoryView from './HistoryView';

test('requests trashed tasks and renders them', async () => {
  tasks.list.mockResolvedValue({ data: [{ id: 9, title: 'Old Standup Notes', body: 'gone', category: { name: 'Work' }, expires_at: null }] });
  render(<MemoryRouter><HistoryView /></MemoryRouter>);
  expect(await screen.findByText('Old Standup Notes')).toBeInTheDocument();
  expect(tasks.list).toHaveBeenCalledWith({ trashed: 'only' });
});
