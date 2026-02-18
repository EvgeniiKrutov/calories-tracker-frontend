import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '@/components/Modal';
import { mockRecords, mockMeals, CATEGORIES } from '@/data/mock';
import type { NutritionRecord } from '@/types';
import { useAppIntl } from '@/hooks/useAppIntl';

const emptyForm: Omit<NutritionRecord, 'id'> = {
  mealName: '',
  category: 'Breakfast',
  date: new Date().toISOString().slice(0, 16),
  kcal: 0,
  fat: 0,
  saturatedFat: 0,
  protein: 0,
  salt: 0,
  sugar: 0,
  carb: 0,
  fibre: 0,
};

const FIELDS = [
  { key: 'kcal' as const, label: 'Calories', unit: 'kcal' },
  { key: 'protein' as const, label: 'Protein', unit: 'g' },
  { key: 'carb' as const, label: 'Carbs', unit: 'g' },
  { key: 'fat' as const, label: 'Fat', unit: 'g' },
  { key: 'saturatedFat' as const, label: 'Sat. Fat', unit: 'g' },
  { key: 'sugar' as const, label: 'Sugar', unit: 'g' },
  { key: 'salt' as const, label: 'Salt', unit: 'g' },
  { key: 'fibre' as const, label: 'Fibre', unit: 'g' },
];

export default function Records() {
  const { formatMessage, records: recordsMessages, common } = useAppIntl();
  const [records, setRecords] = useState<NutritionRecord[]>(mockRecords);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openCreate = () => {
    setEditId(null);
    setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 16) });
    setModalOpen(true);
  };

  const openEdit = (r: NutritionRecord) => {
    setEditId(r.id);
    const { id, ...rest } = r;
    setForm({ ...rest, date: r.date.slice(0, 16) });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editId) {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === editId
            ? { ...r, ...form, date: new Date(form.date).toISOString() }
            : r,
        ),
      );
    } else {
      setRecords((prev) => [
        {
          ...form,
          id: crypto.randomUUID(),
          date: new Date(form.date).toISOString(),
        },
        ...prev,
      ]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    setDeleteId(null);
  };

  const set = (key: string, val: string | number) =>
    setForm((p) => ({ ...p, [key]: val }));

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">
            {formatMessage(recordsMessages.title)}
          </h1>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="h-3.5 w-3.5" />
          {formatMessage(recordsMessages.addRecord)}
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px]">
            <thead>
              <tr className="border-b border-bg-border bg-bg-overlay">
                <th className="table-head">{formatMessage(common.date)}</th>
                <th className="table-head">
                  {formatMessage(recordsMessages.meal)}
                </th>
                <th className="table-head-right">
                  {formatMessage(common.kcal)}
                </th>
                <th className="table-head-right">
                  {formatMessage(common.protein)}
                </th>
                <th className="table-head-right">
                  {formatMessage(common.carbs)}
                </th>
                <th className="table-head-right">
                  {formatMessage(common.fat)}
                </th>
                <th className="table-head-right">
                  {formatMessage(common.sugar)}
                </th>
                <th className="table-head-right">
                  {formatMessage(common.salt)}
                </th>
                <th className="table-head-right">
                  {formatMessage(common.fibre)}
                </th>
                <th className="table-head-right w-20">
                  <span className="sr-only">
                    {formatMessage(common.actions)}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-border">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-bg-subtle/40">
                  <td className="table-cell whitespace-nowrap">
                    <span className="text-text-primary">{fmtDate(r.date)}</span>
                    <span className="ml-2 font-mono text-[11px] text-text-tertiary">
                      {fmtTime(r.date)}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className="text-text-primary font-medium">
                      {r.mealName}
                    </span>
                  </td>
                  <td className="table-cell text-right font-mono text-sm font-medium text-accent-text">
                    {Math.round(r.kcal)}
                  </td>
                  <td className="table-cell text-right font-mono text-sm text-text-secondary">
                    {r.protein.toFixed(1)}
                  </td>
                  <td className="table-cell text-right font-mono text-sm text-text-secondary">
                    {r.carb.toFixed(1)}
                  </td>
                  <td className="table-cell text-right font-mono text-sm text-text-secondary">
                    {r.fat.toFixed(1)}
                  </td>
                  <td className="table-cell text-right font-mono text-sm text-text-secondary">
                    {r.sugar.toFixed(1)}
                  </td>
                  <td className="table-cell text-right font-mono text-sm text-text-secondary">
                    {r.salt.toFixed(1)}
                  </td>
                  <td className="table-cell text-right font-mono text-sm text-text-secondary">
                    {r.fibre.toFixed(1)}
                  </td>
                  <td className="table-cell">
                    <div className="flex justify-end gap-0.5">
                      <button
                        onClick={() => openEdit(r)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary hover:bg-bg-muted hover:text-text-secondary"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => setDeleteId(r.id)}
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
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          editId
            ? formatMessage(recordsMessages.editRecord)
            : formatMessage(recordsMessages.newRecord)
        }
      >
        <div className="space-y-3.5">
          <div>
            <label className="label">
              {formatMessage(recordsMessages.meal)} {formatMessage(common.name)}
            </label>
            <select
              value={form.mealName}
              onChange={(e) => set('mealName', e.target.value)}
              className="input-field"
            >
              <option value="">
                {formatMessage(recordsMessages.selectMeal)}
              </option>
              {mockMeals.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">
              {formatMessage(recordsMessages.category)}
            </label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="input-field"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">{formatMessage(common.date)} & Time</label>
            <input
              type="datetime-local"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              className="input-field [color-scheme:dark]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {FIELDS.map((f) => (
              <div key={f.key}>
                <label className="label">
                  {f.label}{' '}
                  <span className="text-text-tertiary/60">({f.unit})</span>
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
            <button onClick={() => setModalOpen(false)} className="btn-ghost">
              {formatMessage(common.cancel)}
            </button>
            <button onClick={handleSave} className="btn-primary">
              {editId ? formatMessage(common.save) : formatMessage(common.save)}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title={formatMessage(common.delete)}
        width="sm"
      >
        <p className="text-sm text-text-secondary">
          {formatMessage(common.confirmDelete)}
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={() => setDeleteId(null)} className="btn-ghost">
            {formatMessage(common.cancel)}
          </button>
          <button
            onClick={() => deleteId && handleDelete(deleteId)}
            className="btn-danger"
          >
            {formatMessage(common.delete)}
          </button>
        </div>
      </Modal>
    </div>
  );
}
