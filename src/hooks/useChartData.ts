import { useEffect, useState } from 'react';
import { getOneRequest } from '@/utils/requests';
import { CURRENT_USER_ID } from '@/utils/user';
import type {
  ChartCategory,
  ChartRangeState,
  ChartResponse,
  ChartSeriesPoint,
} from '@/types';

const RANGE_DAYS = { week: 7, month: 30 };

const toIsoDay = (date: Date): string => date.toISOString().slice(0, 10);

const shiftDay = (day: string, offset: number): string => {
  const date = new Date(`${day}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + offset);
  return toIsoDay(date);
};

const formatDayLabel = (day: string): string =>
  new Date(`${day}T00:00:00.000Z`)
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      timeZone: 'UTC',
    })
    .replace('/', '.');

function toSeries(response: ChartResponse): ChartSeriesPoint[] {
  if (!response?.points) return [];

  const values = new Map(
    response.points.map((point) => [point.date.slice(0, 10), point.value]),
  );
  const last = response.end.slice(0, 10);
  const series: ChartSeriesPoint[] = [];

  for (let day = response.start.slice(0, 10); day < last; day = shiftDay(day, 1))
    series.push({ day, date: formatDayLabel(day), value: values.get(day) ?? 0 });

  return series;
}

export function useChartData(category: ChartCategory, reloadKey?: unknown) {
  const [range, setRange] = useState<ChartRangeState>(() => {
    const today = toIsoDay(new Date());
    return {
      range: 'week',
      start: shiftDay(today, -(RANGE_DAYS.week - 1)),
      end: today,
    };
  });
  const [data, setData] = useState<ChartSeriesPoint[]>([]);

  const { range: period, start, end } = range;

  useEffect(() => {
    if (period === 'custom' && (!start || !end)) return;

    let cancelled = false;

    const load = async () => {
      const response = await getOneRequest<ChartResponse>('records/chart', {
        userId: CURRENT_USER_ID,
        category,
        period,
        ...(period === 'custom' ? { start, end } : {}),
      });
      if (!cancelled) setData(toSeries(response));
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [category, period, start, end, reloadKey]);

  return [range, setRange, data] as const;
}
