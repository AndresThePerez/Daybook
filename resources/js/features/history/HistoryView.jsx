import { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import CategoryTag from '../../components/ui/CategoryTag';
import { tasks } from '../../lib/api';

export default function HistoryView() {
  const [items, setItems] = useState(null);
  useEffect(() => { tasks.list({ trashed: 'only' }).then((r) => setItems(r.data)); }, []);
  if (!items) return <Spinner />;
  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-[38px] font-extrabold leading-none">History</h1>
        <p className="mt-2 font-mono text-[13px] text-ink-soft">deleted tasks · read-only</p>
      </header>
      {items.length === 0 ? <EmptyState title="Nothing in history yet." /> : (
        <div className="flex flex-col gap-2.5">
          {items.map((t) => (
            <Card key={t.id} className="grid grid-cols-[110px_1fr] items-center gap-4 bg-sunken px-4 py-4 opacity-70">
              <CategoryTag name={t.category?.name ?? '—'} />
              <div className="min-w-0">
                <div className="truncate text-[15px] font-semibold text-ink line-through decoration-ink-faint">{t.title}</div>
                <div className="truncate text-[13.5px] text-ink-soft">{t.body}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
