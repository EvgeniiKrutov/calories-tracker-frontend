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

export interface RecordPayload {
  userId: string;
  mealId: string;
  category: string;
  date: string;
  grams: number;
}

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

export interface ChartRangeState {
  range: ChartRange;
  start: string;
  end: string;
}

export type ChartCategory = 'kcal' | 'saturatedFat' | 'sugar' | 'salt';

export interface ChartResponse {
  userId: string;
  category: ChartCategory;
  period: ChartRange;
  start: string;
  end: string;
  points: { date: string; value: number }[];
}

export interface ChartSeriesPoint {
  day: string;
  date: string;
  value: number;
}
