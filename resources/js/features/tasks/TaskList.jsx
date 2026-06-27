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
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  function load(page = 1, append = false) {
    setLoading(true);
    tasks.list({
      ...(categoryId ? { category_id: categoryId } : {}),
      ...(page > 1 ? { page } : {}),
    })
      .then((res) => {
        setMeta(res.meta);
        if (append) {
          setItems((prev) => [...prev, ...res.data]);
        } else {
          setItems(res.data);
        }
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    setItems([]);
    setMeta(null);
    load(1, false);
  }, [categoryId]);

  const count = meta?.total ?? items.length;

  return (
    <div>
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-display text-[38px] font-extrabold leading-none">Today</h1>
          <p className="mt-2 font-mono text-[13px] text-ink-soft">{count} open</p>
        </div>
        <Link to="/tasks/create"><Button><span className="text-lg leading-none">+</span> New task</Button></Link>
      </header>

      {loading && items.length === 0 ? <Spinner /> : items.length === 0 ? (
        <EmptyState
          title="Nothing on today's list. Add the first task."
          action={<Link to="/tasks/create"><Button>New task</Button></Link>}
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {items.map((t) => <TaskRow key={t.id} task={t} onDeleted={() => load()} />)}
        </div>
      )}

      {meta && meta.current_page < meta.last_page && (
        <div className="mt-4">
          <Button variant="ghost" onClick={() => load(meta.current_page + 1, true)}>
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
