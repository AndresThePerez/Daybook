import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { categories } from '../../lib/api';

const CAT_COLORS = {
  work: '#4C6FB1', personal: '#8A6DB0', shopping: '#C77D4A',
  health: '#4F9E83', finance: '#B0894C', education: '#6E7E55',
};

export default function CategoryList() {
  const [items, setItems] = useState(null);
  useEffect(() => { categories.list().then((r) => setItems(r.data)); }, []);
  if (!items) return <Spinner />;
  return (
    <div>
      <header className="mb-6 flex items-end justify-between">
        <h1 className="font-display text-[38px] font-extrabold leading-none">Categories</h1>
        <Link to="/categories/create"><Button><span className="text-lg leading-none">+</span> New category</Button></Link>
      </header>
      {items.length === 0 ? (
        <EmptyState title="No categories yet." action={<Link to="/categories/create"><Button>New category</Button></Link>} />
      ) : (
        <div className="flex flex-col gap-2.5">
          {items.map((c) => (
            <Link key={c.id} to={`/categories/${c.id}`}>
              <Card className="flex items-center gap-3 px-4 py-4 transition hover:-translate-y-px">
                <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: CAT_COLORS[c.name.toLowerCase()] ?? '#97A0B0' }} />
                <span className="text-[15.5px] font-semibold text-ink">{c.name}</span>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
