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
