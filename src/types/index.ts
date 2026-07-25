export interface NutritionRecord {
  id: string;
  mealId: string;
  mealName: string;
  category: string;
  date: string;
  grams: number;
  kcal: number;
  fat: number;
  saturatedFat: number;
  protein: number;
  salt: number;
  sugar: number;
  carb: number;
  fibre: number;
}

/** Payload accepted by POST/PUT /records — the BE derives nutrition from meal + grams. */
export interface RecordPayload {
  userId: string;
  mealId: string;
  category: string;
  date: string;
  grams: number;
}

/** Response of GET /records/summary — nutrition totals for one user and day. */
export interface DailySummary {
  userId: string;
  date: string;
  kcal: number;
  fat: number;
  saturatedFat: number;
  protein: number;
  salt: number;
  sugar: number;
  carb: number;
  fibre: number;
}

export interface Meal {
  id: string;
  name: string;
  kcal: number;
  fat: number;
  saturatedFat: number;
  protein: number;
  salt: number;
  sugar: number;
  carb: number;
  fibre: number;
}

export type NutritionKey = keyof Pick<
  NutritionRecord,
  | 'kcal'
  | 'fat'
  | 'saturatedFat'
  | 'protein'
  | 'salt'
  | 'sugar'
  | 'carb'
  | 'fibre'
>;

export type ChartRange = 'week' | 'month' | 'custom';

/** Range shown by a daily chart widget; the dates only apply to 'custom'. */
export interface ChartRangeState {
  range: ChartRange;
  /** Inclusive ISO day (yyyy-mm-dd), empty when unbounded. */
  start: string;
  /** Inclusive ISO day (yyyy-mm-dd), empty when unbounded. */
  end: string;
}

/** Nutrition metrics GET /records/chart can aggregate. */
export type ChartCategory = 'kcal' | 'saturatedFat' | 'sugar' | 'salt';

/** Response of GET /records/chart — one daily total per day that has records. */
export interface ChartResponse {
  userId: string;
  category: ChartCategory;
  period: ChartRange;
  /** Inclusive ISO day the aggregation starts at. */
  start: string;
  /** Exclusive ISO day the aggregation stops at. */
  end: string;
  points: { date: string; value: number }[];
}

/** A chart point after gap filling, ready for recharts. */
export interface ChartSeriesPoint {
  /** ISO day (yyyy-mm-dd). */
  day: string;
  /** Short dd.mm label shown on the X axis. */
  date: string;
  value: number;
}
