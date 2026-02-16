import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '@/components/Modal';
import { mockMeals, CATEGORIES } from '@/data/mock';
import type { Meal } from '@/types';

const emptyForm: Omit<Meal, 'id'> = {
  name: '',
  category: 'Breakfast',
  kcal: 0,
  fat: 0,
  saturatedFat: 0,
  protein: 0,
  salt: 0,
  sugar: 0,
  carb: 0,
};

const FIELDS = [
  { key: 'kcal' as const, label: 'Calories', unit: 'kcal' },
  { key: 'protein' as const, label: 'Protein', unit: 'g' },
  { key: 'carb' as const, label: 'Carbs', unit: 'g' },
  { key: 'fat' as const, label: 'Fat', unit: 'g' },
  { key: 'saturatedFat' as const, label: 'Sat. Fat', unit: 'g' },
  { key: 'sugar' as const, label: 'Sugar', unit: 'g' },
  { key: 'salt' as const, label: 'Salt', unit: 'g' },
];

export default function Meals() {
  const [meals, setMeals] = useState<Meal[]>(mockMeals);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openCreate = () => {
    setEditId(null);
    setForm({ ...emptyForm });
    setModalOpen(true);
  };

  const openEdit = (m: Meal) => {
    setEditId(m.id);
    const { id, ...rest } = m;
    setForm(rest);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editId) {
      setMeals((prev) => prev.map((m) => (m.id === editId ? { ...m, ...form } : m)));
    } else {
      setMeals((prev) => [{ ...form, id: crypto.randomUUID() }, ...prev]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
    setDeleteId(null);
  };

  const set = (key: string, val: string | number) =>
    setForm((p) => ({ ...p, [key]: val }));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Meals</h1>
          <p className="mt-0.5 text-[13px] text-text-tertiary">
            {meals.length} saved meals &middot; Reusable when adding records
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="h-3.5 w-3.5" />
          Add Meal
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px]">
            <thead>
              <tr className="border-b border-bg-border bg-bg-overlay">
                <th className="table-head">Name</th>
                <th className="table-head">Category</th>
                <th className="table-head-right">Kcal</th>
                <th className="table-head-right">Protein</th>
                <th className="table-head-right">Carbs</th>
                <th className="table-head-right">Fat</th>
                <th className="table-head-right">Sugar</th>
                <th className="table-head-right w-20">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-border">
              {meals.map((m) => (
                <tr key={m.id} className="hover:bg-bg-subtle/40">
                  <td className="table-cell font-medium text-text-primary">{m.name}</td>
                  <td className="table-cell">
                    <span className="inline-block rounded-md border border-bg-border bg-bg-muted px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                      {m.category}
                    </span>
                  </td>
                  <td className="table-cell text-right font-mono text-sm font-medium text-accent-text">
                    {m.kcal}
                  </td>
                  <td className="table-cell text-right font-mono text-sm text-text-secondary">
                    {m.protein}
                  </td>
                  <td className="table-cell text-right font-mono text-sm text-text-secondary">
                    {m.carb}
                  </td>
                  <td className="table-cell text-right font-mono text-sm text-text-secondary">
                    {m.fat}
                  </td>
                  <td className="table-cell text-right font-mono text-sm text-text-secondary">
                    {m.sugar}
                  </td>
                  <td className="table-cell">
                    <div className="flex justify-end gap-0.5">
                      <button
                        onClick={() => openEdit(m)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary hover:bg-bg-muted hover:text-text-secondary"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => setDeleteId(m.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary hover:bg-rose-muted hover:text-rose-text"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Meal' : 'New Meal'}>
        <div className="space-y-3.5">
          <div>
            <label className="label">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Grilled Chicken Salad"
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Category</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)} className="input-field">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {FIELDS.map((f) => (
              <div key={f.key}>
                <label className="label">
                  {f.label} <span className="text-text-tertiary/60">({f.unit})</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={form[f.key]}
                  onChange={(e) => set(f.key, parseFloat(e.target.value) || 0)}
                  className="input-field font-mono"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button onClick={() => setModalOpen(false)} className="btn-ghost">Cancel</button>
            <button onClick={handleSave} className="btn-primary">{editId ? 'Update' : 'Create'}</button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete Meal" width="sm">
        <p className="text-sm text-text-secondary">
          This meal will be permanently deleted. This can't be undone.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={() => setDeleteId(null)} className="btn-ghost">Cancel</button>
          <button onClick={() => deleteId && handleDelete(deleteId)} className="btn-danger">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
