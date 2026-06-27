import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import TaskRow from './TaskRow';
import { tasks } from '../../lib/api';

export default function TaskList() {
  const [params] = useSearchParams();
  const categoryId = params.get('category');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    tasks.list(categoryId ? { category_id: categoryId } : undefined)
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }
  useEffect(load, [categoryId]);

  const items = data?.data ?? [];
  return (
    <div>
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-display text-[38px] font-extrabold leading-none">Today</h1>
          <p className="mt-2 font-mono text-[13px] text-ink-soft">{items.length} open</p>
        </div>
        <Link to="/tasks/create"><Button><span className="text-lg leading-none">+</span> New task</Button></Link>
      </header>

      {loading ? <Spinner /> : items.length === 0 ? (
        <EmptyState
          title="Nothing on today's list. Add the first task."
          action={<Link to="/tasks/create"><Button>New task</Button></Link>}
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {items.map((t) => <TaskRow key={t.id} task={t} onDeleted={load} />)}
        </div>
      )}
    </div>
  );
}
