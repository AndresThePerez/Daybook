import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { categories, validationErrors } from '../../lib/api';
import { useAppData } from '../../AppData';

export default function CategoryForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { reloadCategories } = useAppData();
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => { if (isEdit) categories.show(id).then((c) => setName(c.name)); }, [id, isEdit]);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await (isEdit ? categories.update(id, { name }) : categories.create({ name }));
      toast.success('Category saved');
      reloadCategories();
      navigate('/categories');
    } catch (err) {
      const v = validationErrors(err);
      if (v) setError(v.name?.[0]); else toast.error('Could not save the category');
    }
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-[32px] font-extrabold">{isEdit ? 'Edit category' : 'New category'}</h1>
      <Card as="form" onSubmit={onSubmit} className="flex flex-col gap-5 p-6">
        <Input label="Name" id="name" value={name} onChange={(e) => setName(e.target.value)} error={error} />
        <div className="flex gap-3">
          <Button type="submit">Save category</Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/categories')}>Cancel</Button>
        </div>
      </Card>
    </div>
  );
}
