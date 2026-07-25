import type { Meal, NutritionRecord, RecordPayload } from '@/types';
import Modal from '../Modal';
import { useEffect, useMemo, useState } from 'react';
import { useAppIntl } from '@/hooks/useAppIntl';
import { CATEGORIES, FIELDS } from '@/data/mock';
import { getRequest, updateRequest } from '@/utils/requests';
import { CURRENT_USER_ID } from '@/utils/user';

interface RecordModalProps {
  setRecordModalOpen: (open: boolean) => void;
  isEditing?: boolean;
  recordToEdit?: NutritionRecord;
}

interface RecordForm {
  mealId: string;
  category: string;
  date: string;
  grams: number | string;
}

const toInputDate = (iso: string) => {
  const parsed = new Date(iso);
  if (isNaN(parsed.getTime())) return '';
  const offset = parsed.getTimezoneOffset() * 60_000;
  return new Date(parsed.getTime() - offset).toISOString().slice(0, 16);
};

const emptyRecordForm: RecordForm = {
  mealId: '',
  category: CATEGORIES[0],
  date: toInputDate(new Date().toISOString()),
  grams: 100,
};

const RecordModal: React.FC<RecordModalProps> = ({
  setRecordModalOpen,
  isEditing,
  recordToEdit,
}) => {
  const { formatMessage, common } = useAppIntl();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [recordForm, setRecordForm] = useState<RecordForm>(
    isEditing && recordToEdit
      ? {
          mealId: recordToEdit.mealId,
          category: recordToEdit.category,
          date: toInputDate(recordToEdit.date),
          grams: recordToEdit.grams,
        }
      : emptyRecordForm,
  );

  useEffect(() => {
    const fetchMeals = async () => {
      const result = await getRequest<Meal>('meals');
      setMeals(result.data);
    };
    fetchMeals();
  }, []);

  const grams = parseFloat(String(recordForm.grams));
  const selectedMeal = meals.find((m) => m.id === recordForm.mealId);

  // The backend scales the meal's per-100g values by the amount; mirror it so
  // the user sees what will be stored.
  const preview = useMemo(() => {
    if (!selectedMeal || isNaN(grams)) return null;
    const factor = grams / 100;
    return FIELDS.map((f) => ({
      ...f,
      value: selectedMeal[f.key] * factor,
    }));
  }, [selectedMeal, grams]);

  const isFormValid =
    recordForm.mealId !== '' &&
    recordForm.date !== '' &&
    !isNaN(grams) &&
    grams > 0;

  const saveRecord = async () => {
    const payload: RecordPayload = {
      userId: CURRENT_USER_ID,
      mealId: recordForm.mealId,
      category: recordForm.category,
      date: new Date(recordForm.date).toISOString(),
      grams,
    };

    await updateRequest<RecordPayload>(
      `records${isEditing && recordToEdit ? `/${recordToEdit.id}` : ''}`,
      !!isEditing,
      payload,
    );
    setRecordModalOpen(false);
  };

  const setRecordField = (key: keyof RecordForm, val: string | number) =>
    setRecordForm((p) => ({ ...p, [key]: val }));

  return (
    <Modal
      open={true}
      onClose={() => setRecordModalOpen(false)}
      title={
        isEditing
          ? formatMessage(common.editRecord)
          : formatMessage(common.newRecord)
      }
    >
      <div className="space-y-3.5">
        <div>
          <label className="label">{formatMessage(common.meal)}</label>
          <select
            value={recordForm.mealId}
            onChange={(e) => setRecordField('mealId', e.target.value)}
            className="input-field"
          >
            <option value="">{formatMessage(common.selectMeal)}</option>
            {meals.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">{formatMessage(common.category)}</label>
          <select
            value={recordForm.category}
            onChange={(e) => setRecordField('category', e.target.value)}
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
          <label className="label">{formatMessage(common.date)}</label>
          <input
            type="datetime-local"
            value={recordForm.date}
            onChange={(e) => setRecordField('date', e.target.value)}
            className="input-field [color-scheme:dark]"
          />
        </div>

        <div>
          <label className="label">
            {formatMessage(common.amount)}{' '}
            <span className="text-text-tertiary/60">
              ({formatMessage(common.grams)})
            </span>
          </label>
          <input
            type="number"
            step="1"
            min="0"
            value={recordForm.grams}
            onFocus={(e) => e.target.select()}
            onChange={(e) => setRecordField('grams', e.target.value)}
            className="input-field font-mono"
          />
        </div>

        {preview && (
          <div className="rounded-lg border border-bg-border bg-bg-subtle/40 p-3">
            <p className="label mb-2">
              {formatMessage(common.nutritionPreview)}
            </p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              {preview.map((f) => (
                <div key={f.key} className="flex justify-between text-xs">
                  <span className="text-text-tertiary">{f.label}</span>
                  <span className="font-mono text-text-secondary">
                    {f.value.toFixed(1)} {f.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={() => setRecordModalOpen(false)}
            className="btn-ghost"
          >
            {formatMessage(common.cancel)}
          </button>
          <button
            onClick={saveRecord}
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

export default RecordModal;
