import { useState } from 'react';
import type { Meal } from '@/types';
import Modal from '../Modal';
import { useAppIntl } from '@/hooks/useAppIntl';
import { FIELDS } from '@/data/mock';
import { updateRequest } from '@/utils/requests';

interface MealModalProps {
  setMealModalOpen: (open: boolean) => void;
  isEditing?: boolean;
  mealToEdit?: Meal;
}

const emptyMealForm: Meal = {
  id: '',
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
  const [mealForm, setMealForm] = useState<Meal>(
    isEditing && mealToEdit ? mealToEdit : emptyMealForm,
  );

  const isFormValid =
    mealForm.name.trim() !== '' &&
    FIELDS.every(
      (f) =>
        !isNaN(parseFloat(String(mealForm[f.key as keyof Omit<Meal, 'id'>]))),
    );

  const saveMeal = async () => {
    await updateRequest<Meal>(
      `meals${!!isEditing ? `/${mealForm.id}` : ''}`,
      !!isEditing,
      mealForm,
    );
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
                onFocus={(e) => e.target.select()}
                onChange={(e) => setMealField(f.key, e.target.value)}
                className="input-field font-mono"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button onClick={() => setMealModalOpen(false)} className="btn-ghost">
            {formatMessage(common.cancel)}
          </button>
          <button
            onClick={saveMeal}
            disabled={!isFormValid}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formatMessage(common.save)}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MealModal;
