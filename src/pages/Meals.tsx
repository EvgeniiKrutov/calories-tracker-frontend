import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '@/components/Modal';
import type { Meal } from '@/types';
import { useAppIntl } from '@/hooks/useAppIntl';
import { getRequest } from '@/utils/requests';
import MealModal from '@/components/modals/MealModal';

export default function Meals() {
  const { formatMessage, common } = useAppIntl();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMeal, setEditMeal] = useState<Meal | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeals = async () => {
      const data = await getRequest('meals');
      setMeals(data);
    };
    fetchMeals();
  }, []);

  const openCreate = () => {
    setEditMeal(null);
    setModalOpen(true);
  };

  const openEdit = (m: Meal) => {
    setEditMeal(m);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">
            {formatMessage(common.meals)}
          </h1>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="h-3.5 w-3.5" />
          {formatMessage(common.addMeal)}
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[560px]">
          <table className="w-full min-w-[780px]">
            <thead>
              <tr className="border-b border-bg-border bg-bg-overlay sticky top-0 z-10">
                <th className="table-head">{formatMessage(common.name)}</th>
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
                <th className="table-head-right w-20 sticky right-0 z-20 bg-bg-overlay">
                  <span className="sr-only">
                    {formatMessage(common.actions)}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-border">
              {meals.map((m) => (
                <tr key={m.id} className="hover:bg-bg-subtle/40">
                  <td className="table-cell font-medium text-text-primary">
                    {m.name}
                  </td>
                  <td className="table-cell text-right font-mono text-sm font-medium text-accent-text">
                    {Math.round(m.kcal)}
                  </td>
                  <td className="table-cell text-right font-mono text-sm text-text-secondary">
                    {m.protein.toFixed(1)}
                  </td>
                  <td className="table-cell text-right font-mono text-sm text-text-secondary">
                    {m.carb.toFixed(1)}
                  </td>
                  <td className="table-cell text-right font-mono text-sm text-text-secondary">
                    {m.fat.toFixed(1)}
                  </td>
                  <td className="table-cell text-right font-mono text-sm text-text-secondary">
                    {m.sugar.toFixed(1)}
                  </td>
                  <td className="table-cell text-right font-mono text-sm text-text-secondary">
                    {m.salt.toFixed(1)}
                  </td>
                  <td className="table-cell text-right font-mono text-sm text-text-secondary">
                    {m.fibre.toFixed(1)}
                  </td>
                  <td className="table-cell sticky right-0 bg-bg-raised">
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

      {modalOpen && (
        <MealModal
          isEditing={!!editMeal}
          mealToEdit={editMeal ?? undefined}
          setMealModalOpen={setModalOpen}
        />
      )}

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
