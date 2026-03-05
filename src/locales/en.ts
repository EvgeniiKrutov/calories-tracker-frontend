import { defineMessages } from 'react-intl';

export const commonMessages = defineMessages({
  appName: { id: 'common.appName', defaultMessage: 'Fit&Track' },
  calories: { id: 'common.calories', defaultMessage: 'Calories' },
  protein: { id: 'common.protein', defaultMessage: 'Protein' },
  carbs: { id: 'common.carbs', defaultMessage: 'Carbs' },
  fat: { id: 'common.fat', defaultMessage: 'Fat' },
  sugar: { id: 'common.sugar', defaultMessage: 'Sugar' },
  salt: { id: 'common.salt', defaultMessage: 'Salt' },
  saturatedFat: { id: 'common.saturatedFat', defaultMessage: 'Sat. Fat' },
  fibre: { id: 'common.fibre', defaultMessage: 'Fibre' },
  kcal: { id: 'common.kcal', defaultMessage: 'kcal' },
  grams: { id: 'common.grams', defaultMessage: 'g' },
  name: { id: 'common.name', defaultMessage: 'Name' },
  date: { id: 'common.date', defaultMessage: 'Date' },
  actions: { id: 'common.actions', defaultMessage: 'Actions' },
  save: { id: 'common.save', defaultMessage: 'Save' },
  cancel: { id: 'common.cancel', defaultMessage: 'Cancel' },
  delete: { id: 'common.delete', defaultMessage: 'Delete' },
  confirmDelete: {
    id: 'common.confirmDelete',
    defaultMessage: 'Are you sure you want to delete this item?',
  },
  dashboard: { id: 'common.dashboard', defaultMessage: 'Dashboard' },
  records: { id: 'common.records', defaultMessage: 'Records' },
  meals: { id: 'common.meals', defaultMessage: 'Meals' },
  menu: { id: 'common.menu', defaultMessage: 'Menu' },
  target: { id: 'common.target', defaultMessage: 'Target' },
  // Dashboard
  todaysIntake: { id: 'common.todaysIntake', defaultMessage: "Today's Intake" },
  dayOverview: {
    id: 'common.dayOverview',
    defaultMessage: '{days}-day overview',
  },
  recordsCount: {
    id: 'common.recordsCount',
    defaultMessage: '{count} records',
  },
  dailyCalories: { id: 'common.dailyCalories', defaultMessage: 'Daily Calories' },
  dailySaturatedFat: {
    id: 'common.dailySaturatedFat',
    defaultMessage: 'Daily Saturated Fat',
  },
  dailySugar: { id: 'common.dailySugar', defaultMessage: 'Daily Sugar' },
  dailySalt: { id: 'common.dailySalt', defaultMessage: 'Daily Salt' },
  limits: { id: 'common.limits', defaultMessage: 'Limits' },
  setLimits: { id: 'common.setLimits', defaultMessage: 'Set Limits' },
  editLimits: { id: 'common.editLimits', defaultMessage: 'Edit Limits' },
  limitsDescription: {
    id: 'common.limitsDescription',
    defaultMessage: 'Set daily limits for tracking your nutrition goals',
  },
  // Records
  addRecord: { id: 'common.addRecord', defaultMessage: 'Add Record' },
  newRecord: { id: 'common.newRecord', defaultMessage: 'New Record' },
  editRecord: { id: 'common.editRecord', defaultMessage: 'Edit Record' },
  entriesCount: {
    id: 'common.entriesCount',
    defaultMessage: '{count} entries',
  },
  meal: { id: 'common.meal', defaultMessage: 'Meal' },
  selectMeal: { id: 'common.selectMeal', defaultMessage: 'Select a meal' },
  category: { id: 'common.category', defaultMessage: 'Category' },
  // Meals
  addMeal: { id: 'common.addMeal', defaultMessage: 'Add Meal' },
  newMeal: { id: 'common.newMeal', defaultMessage: 'New Meal' },
  editMeal: { id: 'common.editMeal', defaultMessage: 'Edit Meal' },
  savedMealsCount: {
    id: 'common.savedMealsCount',
    defaultMessage: '{count} saved meals',
  },
  reusableNote: {
    id: 'common.reusableNote',
    defaultMessage: 'Reusable when adding records',
  },
});
