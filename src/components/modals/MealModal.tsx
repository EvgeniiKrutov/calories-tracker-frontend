import { useState } from 'react';
import type { Meal } from '@/types';
import Modal from '../Modal';
import { useAppIntl } from '@/hooks/useAppIntl';
import { FIELDS } from '@/data/mock';

interface MealModalProps {
  setMealModalOpen: (open: boolean) => void;
  isEditing?: boolean;
  mealToEdit?: Meal;
}

const emptyMealForm: Omit<Meal, 'id'> = {
  name: '',
  kcal: 0,
  fat: 0,
  saturatedFat: 0,
  protein: 0,
  salt: 0,
  sugar: 0,
  carb: 0,
  fibre: 0,
};

const MealModal: React.FC<MealModalProps> = ({
  setMealModalOpen,
  isEditing,
  mealToEdit,
}) => {
  const { formatMessage, common } = useAppIntl();
  const [mealForm, setMealForm] = useState<Omit<Meal, 'id'>>(() => {
    if (isEditing && mealToEdit) {
      const { id: _id, ...rest } = mealToEdit;
      return rest;
    }
    return emptyMealForm;
  });

  const saveMeal = () => {
    // CALL API TO SAVE MEAL
    console.log('Saving meal:', mealForm);
    setMealModalOpen(false);
  };

  const setMealField = (key: string, val: string | number) =>
    setMealForm((p) => ({ ...p, [key]: val }));

  return (
    <Modal
      open={true}
      onClose={() => setMealModalOpen(false)}
      title={
        isEditing
          ? formatMessage(common.editMeal)
          : formatMessage(common.newMeal)
      }
    >
      <div className="space-y-3.5">
        <div>
          <label className="label">{formatMessage(common.name)}</label>
          <input
            type="text"
            value={mealForm.name}
            onChange={(e) => setMealField('name', e.target.value)}
            placeholder="e.g. Grilled Chicken Salad"
            className="input-field"
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
                value={mealForm[f.key]}
                onChange={(e) =>
                  setMealField(f.key, parseFloat(e.target.value) || 0)
                }
                className="input-field font-mono"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button onClick={() => setMealModalOpen(false)} className="btn-ghost">
            {formatMessage(common.cancel)}
          </button>
          <button onClick={saveMeal} className="btn-primary">
            {formatMessage(common.save)}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MealModal;
