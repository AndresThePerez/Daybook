import { describe, it, expect, vi, beforeEach } from 'vitest';

const { get, post, put, del } = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  del: vi.fn(),
}));

vi.mock('axios', () => ({
  default: { create: () => ({ get, post, put, delete: del }) },
}));

import { tasks, validationErrors } from './api';

beforeEach(() => { get.mockReset(); post.mockReset(); put.mockReset(); del.mockReset(); });

describe('api.tasks', () => {
  it('list returns the paginated envelope', async () => {
    get.mockResolvedValue({ data: { data: [{ id: 1 }], links: {}, meta: { total: 1 } } });
    const res = await tasks.list({ category_id: 2 });
    expect(get).toHaveBeenCalledWith('/tasks', { params: { category_id: 2 } });
    expect(res.data).toHaveLength(1);
  });

  it('show unwraps the single resource', async () => {
    get.mockResolvedValue({ data: { data: { id: 7, title: 'X' } } });
    expect(await tasks.show(7)).toEqual({ id: 7, title: 'X' });
  });

  it('create posts and unwraps', async () => {
    post.mockResolvedValue({ data: { data: { id: 9 } } });
    expect(await tasks.create({ title: 'A' })).toEqual({ id: 9 });
    expect(post).toHaveBeenCalledWith('/tasks', { title: 'A' });
  });
});

describe('validationErrors', () => {
  it('returns errors on 422', () => {
    const err = { response: { status: 422, data: { errors: { title: ['x'] } } } };
    expect(validationErrors(err)).toEqual({ title: ['x'] });
  });
  it('returns null otherwise', () => {
    expect(validationErrors({ response: { status: 404, data: {} } })).toBeNull();
  });
});
