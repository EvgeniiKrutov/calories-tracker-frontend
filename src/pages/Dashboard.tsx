import { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Flame, Beef, Wheat, Droplets, Settings, Plus } from 'lucide-react';
import { mockRecords, mockMeals, CATEGORIES } from '@/data/mock';
import { useAppIntl } from '@/hooks/useAppIntl';
import Modal from '@/components/Modal';
import type { NutritionRecord } from '@/types';

const COLORS = {
  kcal: '#7c6aef',
  protein: '#34d399',
  carb: '#fbbf24',
  fat: '#f43f5e',
  sugar: '#f472b6',
  salt: '#06b6d4',
  saturatedFat: '#fb923c',
};

const tooltipStyle = {
  contentStyle: {
    backgroundColor: '#141418',
    border: '1px solid #26262e',
    borderRadius: '8px',
    fontSize: '12px',
    fontFamily: 'JetBrains Mono, monospace',
    padding: '8px 12px',
    boxShadow: '0 8px 24px rgba(0,0,0,.4)',
  },
  itemStyle: { color: '#e8e8ed', padding: '1px 0' },
  labelStyle: { color: '#5a5a6e', marginBottom: '4px', fontSize: '11px' },
  cursor: false,
};

const axisStyle = {
  fill: '#5a5a6e',
  fontSize: 11,
  fontFamily: 'JetBrains Mono',
};

const emptyRecordForm: Omit<NutritionRecord, 'id'> = {
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

export default function Dashboard() {
  const { formatMessage, dashboard, common } = useAppIntl();

  const [limits, setLimits] = useState({
    kcal: 2200,
    saturatedFat: 70,
    sugar: 40,
    salt: 5,
  });
  const [limitsModalOpen, setLimitsModalOpen] = useState(false);
  const [limitsForm, setLimitsForm] = useState(limits);

  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [recordForm, setRecordForm] = useState(emptyRecordForm);

  const openRecordModal = () => {
    setRecordForm({
      ...emptyRecordForm,
      date: new Date().toISOString().slice(0, 16),
    });
    setRecordModalOpen(true);
  };

  const saveRecord = () => {
    // In a real app, this would save to a backend or state management
    console.log('Saving record:', recordForm);
    setRecordModalOpen(false);
  };

  const setRecordField = (key: string, val: string | number) =>
    setRecordForm((p) => ({ ...p, [key]: val }));

  const openLimitsModal = () => {
    setLimitsForm(limits);
    setLimitsModalOpen(true);
  };

  const saveLimits = () => {
    setLimits(limitsForm);
    setLimitsModalOpen(false);
  };

  const dailyData = useMemo(() => {
    const grouped: Record<
      string,
      { kcal: number; protein: number; carb: number; fat: number }
    > = {};
    mockRecords.forEach((r) => {
      const day = r.date.slice(0, 10);
      if (!grouped[day])
        grouped[day] = { kcal: 0, protein: 0, carb: 0, fat: 0 };
      grouped[day].kcal += r.kcal;
      grouped[day].protein += r.protein;
      grouped[day].carb += r.carb;
      grouped[day].fat += r.fat;
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, v]) => ({
        date: new Date(date)
          .toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })
          .replace('/', '.'),
        kcal: Math.round(v.kcal),
        protein: Math.round(v.protein),
        carb: Math.round(v.carb),
        fat: Math.round(v.fat),
      }));
  }, []);

  const categoryData = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayRecords = mockRecords.filter(
      (r) => r.date.slice(0, 10) === today,
    );

    return todayRecords.reduce(
      (acc, r) => ({
        kcal: acc.kcal + r.kcal,
        protein: acc.protein + r.protein,
        carb: acc.carb + r.carb,
        fat: acc.fat + r.fat,
        salt: acc.salt + r.salt,
      }),
      { kcal: 0, protein: 0, carb: 0, fat: 0, salt: 0 },
    );
  }, []);

  const unhealthyData = useMemo(() => {
    const grouped: Record<
      string,
      { saturatedFat: number; sugar: number; salt: number }
    > = {};
    mockRecords.forEach((r) => {
      const day = r.date.slice(0, 10);
      if (!grouped[day]) grouped[day] = { saturatedFat: 0, sugar: 0, salt: 0 };
      grouped[day].saturatedFat += r.saturatedFat;
      grouped[day].sugar += r.sugar;
      grouped[day].salt += r.salt;
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, v]) => ({
        date: new Date(date)
          .toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })
          .replace('/', '.'),
        saturatedFat: Math.round(v.saturatedFat * 10) / 10,
        sugar: Math.round(v.sugar * 10) / 10,
        salt: Math.round(v.salt * 10) / 10,
      }));
  }, []);

  const totals = useMemo(() => {
    const sum = mockRecords.reduce(
      (acc, r) => ({
        kcal: acc.kcal + r.kcal,
        protein: acc.protein + r.protein,
        carb: acc.carb + r.carb,
        fat: acc.fat + r.fat,
      }),
      { kcal: 0, protein: 0, carb: 0, fat: 0 },
    );
    const days = new Set(mockRecords.map((r) => r.date.slice(0, 10))).size;
    return {
      avgKcal: Math.round(sum.kcal / days),
      avgProtein: Math.round(sum.protein / days),
      avgCarb: Math.round(sum.carb / days),
      avgFat: Math.round(sum.fat / days),
      total: mockRecords.length,
      days,
    };
  }, []);

  console.log(dailyData);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-text-primary">
          {formatMessage(dashboard.title)}
        </h1>
      </div>

      {/* Charts — row 1 */}
      <div className="grid gap-3 lg:grid-cols-7">
        {/* Today's Totals */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            {formatMessage(dashboard.todaysIntake)}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${COLORS.kcal}18`,
                    color: COLORS.kcal,
                  }}
                >
                  <Flame className="h-4 w-4" />
                </div>
                <span className="text-sm text-text-secondary">
                  {formatMessage(common.calories)}
                </span>
              </div>
              <span className="font-mono text-xl font-bold text-text-primary">
                {Math.round(categoryData.kcal)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${COLORS.protein}18`,
                    color: COLORS.protein,
                  }}
                >
                  <Beef className="h-4 w-4" />
                </div>
                <span className="text-sm text-text-secondary">
                  {formatMessage(common.protein)}
                </span>
              </div>
              <span className="font-mono text-xl font-bold text-text-primary">
                {Math.round(categoryData.protein)}
                <span className="text-sm text-text-tertiary ml-1">
                  {formatMessage(common.grams)}
                </span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${COLORS.carb}18`,
                    color: COLORS.carb,
                  }}
                >
                  <Wheat className="h-4 w-4" />
                </div>
                <span className="text-sm text-text-secondary">
                  {formatMessage(common.carbs)}
                </span>
              </div>
              <span className="font-mono text-xl font-bold text-text-primary">
                {Math.round(categoryData.carb)}
                <span className="text-sm text-text-tertiary ml-1">
                  {formatMessage(common.grams)}
                </span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${COLORS.fat}18`,
                    color: COLORS.fat,
                  }}
                >
                  <Droplets className="h-4 w-4" />
                </div>
                <span className="text-sm text-text-secondary">
                  {formatMessage(common.fat)}
                </span>
              </div>
              <span className="font-mono text-xl font-bold text-text-primary">
                {Math.round(categoryData.fat)}
                <span className="text-sm text-text-tertiary ml-1">
                  {formatMessage(common.grams)}
                </span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${COLORS.salt}18`,
                    color: COLORS.salt,
                  }}
                >
                  <Droplets className="h-4 w-4" />
                </div>
                <span className="text-sm text-text-secondary">
                  {formatMessage(common.salt)}
                </span>
              </div>
              <span className="font-mono text-xl font-bold text-text-primary">
                {categoryData.salt.toFixed(1)}
                <span className="text-sm text-text-tertiary ml-1">
                  {formatMessage(common.grams)}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Limits */}
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              {formatMessage(dashboard.limits)}
            </h3>
            <button
              onClick={openLimitsModal}
              className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary hover:bg-bg-muted hover:text-text-secondary"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${COLORS.kcal}18`,
                    color: COLORS.kcal,
                  }}
                >
                  <Flame className="h-4 w-4" />
                </div>
                <span className="text-sm text-text-secondary">
                  {formatMessage(common.calories)}
                </span>
              </div>
              <span className="font-mono text-xl font-bold text-text-primary">
                {limits.kcal}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${COLORS.saturatedFat}18`,
                    color: COLORS.saturatedFat,
                  }}
                >
                  <Droplets className="h-4 w-4" />
                </div>
                <span className="text-sm text-text-secondary">
                  {formatMessage(common.saturatedFat)}
                </span>
              </div>
              <span className="font-mono text-xl font-bold text-text-primary">
                {limits.saturatedFat}
                <span className="text-sm text-text-tertiary ml-1">
                  {formatMessage(common.grams)}
                </span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${COLORS.sugar}18`,
                    color: COLORS.sugar,
                  }}
                >
                  <Droplets className="h-4 w-4" />
                </div>
                <span className="text-sm text-text-secondary">
                  {formatMessage(common.sugar)}
                </span>
              </div>
              <span className="font-mono text-xl font-bold text-text-primary">
                {limits.sugar}
                <span className="text-sm text-text-tertiary ml-1">
                  {formatMessage(common.grams)}
                </span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${COLORS.salt}18`,
                    color: COLORS.salt,
                  }}
                >
                  <Droplets className="h-4 w-4" />
                </div>
                <span className="text-sm text-text-secondary">
                  {formatMessage(common.salt)}
                </span>
              </div>
              <span className="font-mono text-xl font-bold text-text-primary">
                {limits.salt}
                <span className="text-sm text-text-tertiary ml-1">
                  {formatMessage(common.grams)}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Calorie trend */}
        <div className="card p-4 lg:col-span-3">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            {formatMessage(dashboard.dailyCalories)}
          </h3>
          <div className="h-56 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="kcalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={COLORS.kcal}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="100%"
                      stopColor={COLORS.kcal}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="#1a1a20"
                  strokeDasharray="none"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={axisStyle}
                  tickLine={false}
                  axisLine={{ stroke: '#26262e' }}
                />
                <YAxis
                  tick={axisStyle}
                  tickLine={false}
                  axisLine={false}
                  width={42}
                />
                <Tooltip {...tooltipStyle} />
                <ReferenceLine
                  y={limits.kcal}
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  strokeDasharray="0"
                  label=""
                />
                <Area
                  type="monotone"
                  dataKey="kcal"
                  stroke={COLORS.kcal}
                  fill="url(#kcalGradient)"
                  strokeWidth={2}
                  name="kcal"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts — row 2: Unhealthy Metrics */}
      <div className="grid gap-3 lg:grid-cols-3">
        {/* Daily Saturated Fat */}
        <div className="card p-4">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            {formatMessage(dashboard.dailySaturatedFat)}
          </h3>
          <div className="h-56 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={unhealthyData}>
                <defs>
                  <linearGradient
                    id="saturatedFatGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={COLORS.saturatedFat}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="100%"
                      stopColor={COLORS.saturatedFat}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="#1a1a20"
                  strokeDasharray="none"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={axisStyle}
                  tickLine={false}
                  axisLine={{ stroke: '#26262e' }}
                />
                <YAxis
                  tick={axisStyle}
                  tickLine={false}
                  axisLine={false}
                  width={36}
                />
                <Tooltip {...tooltipStyle} />
                <ReferenceLine
                  y={limits.saturatedFat}
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  strokeDasharray="0"
                  label=""
                />
                <Area
                  type="monotone"
                  dataKey="saturatedFat"
                  stroke={COLORS.saturatedFat}
                  fill="url(#saturatedFatGradient)"
                  strokeWidth={2}
                  name="Sat. Fat (g)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Sugar */}
        <div className="card p-4">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            {formatMessage(dashboard.dailySugar)}
          </h3>
          <div className="h-56 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={unhealthyData}>
                <defs>
                  <linearGradient
                    id="sugarGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={COLORS.sugar}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="100%"
                      stopColor={COLORS.sugar}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="#1a1a20"
                  strokeDasharray="none"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={axisStyle}
                  tickLine={false}
                  axisLine={{ stroke: '#26262e' }}
                />
                <YAxis
                  tick={axisStyle}
                  tickLine={false}
                  axisLine={false}
                  width={36}
                />
                <Tooltip {...tooltipStyle} />
                <ReferenceLine
                  y={limits.sugar}
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  strokeDasharray="0"
                  label=""
                />
                <Area
                  type="monotone"
                  dataKey="sugar"
                  stroke={COLORS.sugar}
                  fill="url(#sugarGradient)"
                  strokeWidth={2}
                  name="Sugar (g)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Salt */}
        <div className="card p-4">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            {formatMessage(dashboard.dailySalt)}
          </h3>
          <div className="h-56 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={unhealthyData}>
                <defs>
                  <linearGradient id="saltGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={COLORS.salt}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="100%"
                      stopColor={COLORS.salt}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="#1a1a20"
                  strokeDasharray="none"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={axisStyle}
                  tickLine={false}
                  axisLine={{ stroke: '#26262e' }}
                />
                <YAxis
                  tick={axisStyle}
                  tickLine={false}
                  axisLine={false}
                  width={36}
                />
                <Tooltip {...tooltipStyle} />
                <ReferenceLine
                  y={limits.salt}
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  strokeDasharray="0"
                  label=""
                />
                <Area
                  type="monotone"
                  dataKey="salt"
                  stroke={COLORS.salt}
                  fill="url(#saltGradient)"
                  strokeWidth={2}
                  name="Salt (g)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Limits Modal */}
      <Modal
        open={limitsModalOpen}
        onClose={() => setLimitsModalOpen(false)}
        title={formatMessage(dashboard.editLimits)}
      >
        <div className="space-y-3.5">
          <p className="text-sm text-text-secondary">
            {formatMessage(dashboard.limitsDescription)}
          </p>

          <div>
            <label className="label">
              {formatMessage(common.calories)}{' '}
              <span className="text-text-tertiary/60">
                ({formatMessage(common.kcal)})
              </span>
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={limitsForm.kcal}
              onChange={(e) =>
                setLimitsForm({
                  ...limitsForm,
                  kcal: parseFloat(e.target.value) || 0,
                })
              }
              className="input-field font-mono"
            />
          </div>

          <div>
            <label className="label">
              {formatMessage(common.saturatedFat)}{' '}
              <span className="text-text-tertiary/60">
                ({formatMessage(common.grams)})
              </span>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={limitsForm.saturatedFat}
              onChange={(e) =>
                setLimitsForm({
                  ...limitsForm,
                  saturatedFat: parseFloat(e.target.value) || 0,
                })
              }
              className="input-field font-mono"
            />
          </div>

          <div>
            <label className="label">
              {formatMessage(common.sugar)}{' '}
              <span className="text-text-tertiary/60">
                ({formatMessage(common.grams)})
              </span>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={limitsForm.sugar}
              onChange={(e) =>
                setLimitsForm({
                  ...limitsForm,
                  sugar: parseFloat(e.target.value) || 0,
                })
              }
              className="input-field font-mono"
            />
          </div>

          <div>
            <label className="label">
              {formatMessage(common.salt)}{' '}
              <span className="text-text-tertiary/60">
                ({formatMessage(common.grams)})
              </span>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={limitsForm.salt}
              onChange={(e) =>
                setLimitsForm({
                  ...limitsForm,
                  salt: parseFloat(e.target.value) || 0,
                })
              }
              className="input-field font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setLimitsModalOpen(false)}
              className="btn-ghost"
            >
              {formatMessage(common.cancel)}
            </button>
            <button onClick={saveLimits} className="btn-primary">
              {formatMessage(common.save)}
            </button>
          </div>
        </div>
      </Modal>

      {/* Floating Action Button */}
      <button
        onClick={openRecordModal}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg hover:bg-accent/90 transition-all hover:scale-105"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Record Modal */}
      <Modal
        open={recordModalOpen}
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
            <label className="label">{formatMessage(common.date)} & Time</label>
            <input
              type="datetime-local"
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
    </div>
  );
}
