import { useEffect, useMemo, useState } from 'react';
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
import {
  Flame,
  Beef,
  Wheat,
  Droplets,
  Leaf,
  Candy,
  Settings,
  Plus,
} from 'lucide-react';
import { useAppIntl } from '@/hooks/useAppIntl';
import { useChartData } from '@/hooks/useChartData';
import Modal from '@/components/Modal';
import RecordModal from '@/components/modals/RecordModal';
import type { LucideIcon } from 'lucide-react';
import type { MessageDescriptor } from 'react-intl';
import RangeSelector from '@/components/RangeSelector';
import type { DailySummary, NutritionKey } from '@/types';
import { getOneRequest } from '@/utils/requests';
import { CURRENT_USER_ID } from '@/utils/user';
import { commonMessages } from '@/locales/en';

const COLORS = {
  kcal: '#7c6aef',
  protein: '#34d399',
  carb: '#fbbf24',
  fat: '#f43f5e',
  sugar: '#f472b6',
  salt: '#06b6d4',
  saturatedFat: '#fb923c',
  fibre: '#a3e635',
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

interface IntakeRow {
  key: NutritionKey;
  label: MessageDescriptor;
  icon: LucideIcon;
  color: string;
  decimals: number;
  unit: boolean;
}

const INTAKE_ROWS: IntakeRow[] = [
  {
    key: 'kcal',
    label: commonMessages.calories,
    icon: Flame,
    color: COLORS.kcal,
    decimals: 0,
    unit: false,
  },
  {
    key: 'protein',
    label: commonMessages.protein,
    icon: Beef,
    color: COLORS.protein,
    decimals: 0,
    unit: true,
  },
  {
    key: 'carb',
    label: commonMessages.carbs,
    icon: Wheat,
    color: COLORS.carb,
    decimals: 0,
    unit: true,
  },
  {
    key: 'sugar',
    label: commonMessages.sugar,
    icon: Candy,
    color: COLORS.sugar,
    decimals: 1,
    unit: true,
  },
  {
    key: 'fat',
    label: commonMessages.fat,
    icon: Droplets,
    color: COLORS.fat,
    decimals: 0,
    unit: true,
  },
  {
    key: 'saturatedFat',
    label: commonMessages.saturatedFat,
    icon: Droplets,
    color: COLORS.saturatedFat,
    decimals: 1,
    unit: true,
  },
  {
    key: 'fibre',
    label: commonMessages.fibre,
    icon: Leaf,
    color: COLORS.fibre,
    decimals: 1,
    unit: true,
  },
  {
    key: 'salt',
    label: commonMessages.salt,
    icon: Droplets,
    color: COLORS.salt,
    decimals: 1,
    unit: true,
  },
];

const emptySummary = (date: string): DailySummary => ({
  userId: CURRENT_USER_ID,
  date,
  kcal: 0,
  fat: 0,
  saturatedFat: 0,
  protein: 0,
  salt: 0,
  sugar: 0,
  carb: 0,
  fibre: 0,
});

export default function Dashboard() {
  const { formatMessage, common } = useAppIntl();

  const [limits, setLimits] = useState({
    kcal: 2200,
    saturatedFat: 70,
    sugar: 40,
    salt: 5,
  });
  const [limitsModalOpen, setLimitsModalOpen] = useState(false);
  const [limitsForm, setLimitsForm] = useState(limits);

  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);

  const openRecordModal = () => {
    setRecordModalOpen(true);
  };

  const closeRecordModal = () => {
    setRecordModalOpen(false);
    setDataVersion((version) => version + 1);
  };

  const openLimitsModal = () => {
    setLimitsForm(limits);
    setLimitsModalOpen(true);
  };

  const saveLimits = () => {
    setLimits(limitsForm);
    setLimitsModalOpen(false);
  };

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [todaysIntake, setTodaysIntake] = useState<DailySummary>(() =>
    emptySummary(today),
  );

  const fetchTodaysIntake = async () => {
    const summary = await getOneRequest<DailySummary>('records/summary', {
      userId: CURRENT_USER_ID,
      date: today,
    });
    setTodaysIntake(summary);
  };

  useEffect(() => {
    fetchTodaysIntake();
  }, [today, dataVersion]);

  const [kcalRange, setKcalRange, kcalChartData] = useChartData(
    'kcal',
    dataVersion,
  );
  const [saturatedFatRange, setSaturatedFatRange, saturatedFatChartData] =
    useChartData('saturatedFat', dataVersion);
  const [sugarRange, setSugarRange, sugarChartData] = useChartData(
    'sugar',
    dataVersion,
  );
  const [saltRange, setSaltRange, saltChartData] = useChartData(
    'salt',
    dataVersion,
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-text-primary">
          {formatMessage(common.dashboard)}
        </h1>
      </div>

      <div className="grid gap-3 lg:grid-cols-7">
        <div className="card p-5 lg:col-span-2">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            {formatMessage(common.todaysIntake)}
          </h3>
          <div className="space-y-4">
            {INTAKE_ROWS.map(
              ({ key, label, icon: Icon, color, decimals, unit }) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${color}18`, color }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm text-text-secondary">
                      {formatMessage(label)}
                    </span>
                  </div>
                  <span className="font-mono text-xl font-bold text-text-primary">
                    {todaysIntake[key].toFixed(decimals)}
                    {unit && (
                      <span className="text-sm text-text-tertiary ml-1">
                        {formatMessage(common.grams)}
                      </span>
                    )}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              {formatMessage(common.limits)}
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

        <div className="card p-4 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              {formatMessage(common.dailyCalories)}
            </h3>
            <RangeSelector value={kcalRange} onChange={setKcalRange} />
          </div>
          <div className="h-80 lg:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={kcalChartData}>
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
                  dataKey="value"
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

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="card p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              {formatMessage(common.dailySaturatedFat)}
            </h3>
            <RangeSelector
              value={saturatedFatRange}
              onChange={setSaturatedFatRange}
            />
          </div>
          <div className="h-56 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={saturatedFatChartData}>
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
                  dataKey="value"
                  stroke={COLORS.saturatedFat}
                  fill="url(#saturatedFatGradient)"
                  strokeWidth={2}
                  name="Sat. Fat (g)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              {formatMessage(common.dailySugar)}
            </h3>
            <RangeSelector value={sugarRange} onChange={setSugarRange} />
          </div>
          <div className="h-56 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sugarChartData}>
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
                  dataKey="value"
                  stroke={COLORS.sugar}
                  fill="url(#sugarGradient)"
                  strokeWidth={2}
                  name="Sugar (g)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              {formatMessage(common.dailySalt)}
            </h3>
            <RangeSelector value={saltRange} onChange={setSaltRange} />
          </div>
          <div className="h-56 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={saltChartData}>
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
                  dataKey="value"
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

      <Modal
        open={limitsModalOpen}
        onClose={() => setLimitsModalOpen(false)}
        title={formatMessage(common.editLimits)}
      >
        <div className="space-y-3.5">
          <p className="text-sm text-text-secondary">
            {formatMessage(common.limitsDescription)}
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

      <button
        onClick={openRecordModal}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg hover:bg-accent/90 transition-all hover:scale-105"
      >
        <Plus className="h-6 w-6" />
      </button>

      {recordModalOpen && (
        <RecordModal isEditing={false} setRecordModalOpen={closeRecordModal} />
      )}
    </div>
  );
}
