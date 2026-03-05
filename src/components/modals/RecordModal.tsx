import { NutritionRecord } from '@/types';
import Modal from '../Modal';
import { useState } from 'react';
import { useAppIntl } from '@/hooks/useAppIntl';
import { CATEGORIES, FIELDS, mockMeals } from '@/data/mock';

interface RecordModalProps {
  setRecordModalOpen: (open: boolean) => void;
  isEditing?: boolean;
  recordToEdit?: NutritionRecord;
}

const emptyRecordForm: NutritionRecord = {
  id: '',
  mealName: '',
  category: 'Breakfast',
  date: new Date().toISOString().split('T')[0],
  kcal: 0,
  fat: 0,
  saturatedFat: 0,
  protein: 0,
  salt: 0,
  sugar: 0,
  carb: 0,
  fibre: 0,
};

const RecordModal: React.FC<RecordModalProps> = ({
  setRecordModalOpen,
  isEditing,
  recordToEdit,
}) => {
  const { formatMessage, dashboard, common } = useAppIntl();
  const [recordForm, setRecordForm] = useState(
    isEditing && recordToEdit ? recordToEdit : emptyRecordForm,
  );

  const saveRecord = () => {
    // CALL API TO SAVE RECORD ON API
    console.log('Saving record:', recordForm);
    setRecordModalOpen(false);
  };

  const setRecordField = (key: string, val: string | number) =>
    setRecordForm((p) => ({ ...p, [key]: val }));

  return (
    <Modal
      open={true}
      onClose={() => setRecordModalOpen(false)}
      title={formatMessage(dashboard.title)}
    >
      <div className="space-y-3.5">
        <div>
          <label className="label">Meal {formatMessage(common.name)}</label>
          <select
            value={recordForm.mealName}
            onChange={(e) => setRecordField('mealName', e.target.value)}
            className="input-field"
          >
            <option value="">Select a meal</option>
            {mockMeals.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Category</label>
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
            type="date"
            value={recordForm.date}
            onChange={(e) => setRecordField('date', e.target.value)}
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
                value={recordForm[f.key]}
                onChange={(e) =>
                  setRecordField(f.key, parseFloat(e.target.value) || 0)
                }
                className="input-field font-mono"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={() => setRecordModalOpen(false)}
            className="btn-ghost"
          >
            {formatMessage(common.cancel)}
          </button>
          <button onClick={saveRecord} className="btn-primary">
            {formatMessage(common.save)}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RecordModal;
