import type { Meal, NutritionRecord, RecordPayload } from '@/types';
import Modal from '../Modal';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
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
  return parsed.toISOString().slice(0, 10);
};

const toIsoDate = (inputDate: string) => `${inputDate}T00:00:00.000Z`;

const MEAL_PAGE_SIZE = 20;
const MEAL_SCROLL_THRESHOLD = 48;

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

  const [mealPickerOpen, setMealPickerOpen] = useState(false);
  const [mealQuery, setMealQuery] = useState('');
  const [highlightedMeal, setHighlightedMeal] = useState(0);
  const [mealPage, setMealPage] = useState(1);
  const [mealTotalPages, setMealTotalPages] = useState(1);
  const mealPickerRef = useRef<HTMLDivElement>(null);
  const mealInputRef = useRef<HTMLInputElement>(null);
  const mealListRef = useRef<HTMLDivElement>(null);
  const loadingMealsRef = useRef(false);

  const loadMeals = useCallback(async (page: number) => {
    if (loadingMealsRef.current) return;
    loadingMealsRef.current = true;
    try {
      const result = await getRequest<Meal>('meals', page, MEAL_PAGE_SIZE);
      setMeals((prev) =>
        page === 1 ? result.data : [...prev, ...result.data],
      );
      setMealPage(page);
      setMealTotalPages(result.totalPages);
    } finally {
      loadingMealsRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadMeals(1);
  }, [loadMeals]);

  const onMealListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (loadingMealsRef.current || mealPage >= mealTotalPages) return;
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight <= MEAL_SCROLL_THRESHOLD)
      loadMeals(mealPage + 1);
  };

  const grams = parseFloat(String(recordForm.grams));
  const selectedMeal = meals.find((m) => m.id === recordForm.mealId);

  const filteredMeals = useMemo(() => {
    const query = mealQuery.trim().toLowerCase();
    if (!query) return meals;
    return meals.filter((m) => m.name.toLowerCase().includes(query));
  }, [meals, mealQuery]);

  const closeMealPicker = useCallback(() => {
    setMealPickerOpen(false);
    setMealQuery('');
  }, []);

  useEffect(() => {
    if (!mealPickerOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!mealPickerRef.current?.contains(e.target as Node)) closeMealPicker();
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [mealPickerOpen, closeMealPicker]);

  useEffect(() => {
    if (!mealPickerOpen || !mealQuery.trim()) return;
    if (loadingMealsRef.current || mealPage >= mealTotalPages) return;
    loadMeals(mealPage + 1);
  }, [mealPickerOpen, mealQuery, mealPage, mealTotalPages, loadMeals]);

  useEffect(() => {
    if (!mealPickerOpen) return;
    mealListRef.current
      ?.querySelector(`[data-meal-index="${highlightedMeal}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [mealPickerOpen, highlightedMeal]);

  const openMealPicker = () => {
    setMealPickerOpen(true);
    setMealQuery('');
    setHighlightedMeal(Math.max(0, meals.findIndex((m) => m === selectedMeal)));
  };

  const pickMeal = (meal: Meal) => {
    setRecordField('mealId', meal.id);
    closeMealPicker();
  };

  const onMealKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!mealPickerOpen) {
        openMealPicker();
        return;
      }
      if (!filteredMeals.length) return;
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setHighlightedMeal(
        (i) => (i + step + filteredMeals.length) % filteredMeals.length,
      );
      return;
    }

    if (e.key === 'Enter' && mealPickerOpen) {
      const meal = filteredMeals[highlightedMeal];
      if (meal) {
        e.preventDefault();
        pickMeal(meal);
      }
      return;
    }

    if (e.key === 'Escape' && mealPickerOpen) {
      e.preventDefault();
      closeMealPicker();
    }
  };

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
      date: toIsoDate(recordForm.date),
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
        <div ref={mealPickerRef} className="relative">
          <label className="label">{formatMessage(common.meal)}</label>
          <div className="relative">
            <input
              ref={mealInputRef}
              type="text"
              role="combobox"
              aria-expanded={mealPickerOpen}
              aria-autocomplete="list"
              autoComplete="off"
              value={mealPickerOpen ? mealQuery : (selectedMeal?.name ?? '')}
              placeholder={formatMessage(
                mealPickerOpen ? common.searchMeals : common.selectMeal,
              )}
              onFocus={openMealPicker}
              onClick={() => {
                if (!mealPickerOpen) openMealPicker();
              }}
              onChange={(e) => {
                setMealQuery(e.target.value);
                setHighlightedMeal(0);
                if (!mealPickerOpen) setMealPickerOpen(true);
              }}
              onKeyDown={onMealKeyDown}
              className="input-field pr-8"
            />
            <button
              type="button"
              tabIndex={-1}
              aria-label={formatMessage(common.selectMeal)}
              onClick={() => {
                if (mealPickerOpen) closeMealPicker();
                else mealInputRef.current?.focus();
              }}
              className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center text-text-tertiary"
            >
              <ChevronDown className="h-3.5 w-3.5 shrink-0" />
            </button>
          </div>

          {mealPickerOpen && (
            <div
              ref={mealListRef}
              role="listbox"
              onScroll={onMealListScroll}
              className="absolute inset-x-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-lg border border-bg-border bg-bg-overlay py-1 shadow-lg"
            >
              {filteredMeals.map((m, index) => (
                <button
                  key={m.id}
                  type="button"
                  role="option"
                  aria-selected={m.id === recordForm.mealId}
                  data-meal-index={index}
                  onMouseEnter={() => setHighlightedMeal(index)}
                  onClick={() => pickMeal(m)}
                  className={`block w-full px-3 py-2 text-left text-sm ${
                    m.id === recordForm.mealId
                      ? 'bg-bg-subtle text-text-primary'
                      : `text-text-secondary ${index === highlightedMeal ? 'bg-bg-subtle/60' : ''}`
                  }`}
                >
                  {m.name}
                </button>
              ))}

              {!filteredMeals.length && (
                <p className="px-3 py-2 text-sm text-text-tertiary">
                  {formatMessage(common.noMealsFound)}
                </p>
              )}
            </div>
          )}
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
            type="date"
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
