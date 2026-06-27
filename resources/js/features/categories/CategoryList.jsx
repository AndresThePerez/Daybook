import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import CategoryTag from '../../components/ui/CategoryTag';
import { categories } from '../../lib/api';

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
                <CategoryTag name={c.name} />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
