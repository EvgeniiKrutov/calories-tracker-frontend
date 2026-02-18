export interface NutritionRecord {
  id: string;
  mealName: string;
  category: string;
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
