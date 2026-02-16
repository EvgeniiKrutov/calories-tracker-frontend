import { defineMessages } from 'react-intl';

export const commonMessages = defineMessages({
  appName: {
    id: 'common.appName',
    defaultMessage: 'Fit&Track',
  },
  calories: {
    id: 'common.calories',
    defaultMessage: 'Calories',
  },
  protein: {
    id: 'common.protein',
    defaultMessage: 'Protein',
  },
  carbs: {
    id: 'common.carbs',
    defaultMessage: 'Carbs',
  },
  fat: {
    id: 'common.fat',
    defaultMessage: 'Fat',
  },
  sugar: {
    id: 'common.sugar',
    defaultMessage: 'Sugar',
  },
  salt: {
    id: 'common.salt',
    defaultMessage: 'Salt',
  },
  saturatedFat: {
    id: 'common.saturatedFat',
    defaultMessage: 'Sat. Fat',
  },
  fibre: {
    id: 'common.fibre',
    defaultMessage: 'Fibre',
  },
  kcal: {
    id: 'common.kcal',
    defaultMessage: 'kcal',
  },
  grams: {
    id: 'common.grams',
    defaultMessage: 'g',
  },
  name: {
    id: 'common.name',
    defaultMessage: 'Name',
  },
  date: {
    id: 'common.date',
    defaultMessage: 'Date',
  },
  actions: {
    id: 'common.actions',
    defaultMessage: 'Actions',
  },
  save: {
    id: 'common.save',
    defaultMessage: 'Save',
  },
  cancel: {
    id: 'common.cancel',
    defaultMessage: 'Cancel',
  },
  delete: {
    id: 'common.delete',
    defaultMessage: 'Delete',
  },
  confirmDelete: {
    id: 'common.confirmDelete',
    defaultMessage: 'Are you sure you want to delete this item?',
  },
});

export const navMessages = defineMessages({
  dashboard: {
    id: 'nav.dashboard',
    defaultMessage: 'Dashboard',
  },
  records: {
    id: 'nav.records',
    defaultMessage: 'Records',
  },
  meals: {
    id: 'nav.meals',
    defaultMessage: 'Meals',
  },
  menu: {
    id: 'nav.menu',
    defaultMessage: 'Menu',
  },
  target: {
    id: 'nav.target',
    defaultMessage: 'Target',
  },
});

export const dashboardMessages = defineMessages({
  title: {
    id: 'dashboard.title',
    defaultMessage: 'Dashboard',
  },
  dayOverview: {
    id: 'dashboard.dayOverview',
    defaultMessage: '{days}-day overview',
  },
  recordsCount: {
    id: 'dashboard.recordsCount',
    defaultMessage: '{count} records',
  },
  todaysIntake: {
    id: 'dashboard.todaysIntake',
    defaultMessage: "Today's Intake",
  },
  dailyCalories: {
    id: 'dashboard.dailyCalories',
    defaultMessage: 'Daily Calories',
  },
  dailySaturatedFat: {
    id: 'dashboard.dailySaturatedFat',
    defaultMessage: 'Daily Saturated Fat',
  },
  dailySugar: {
    id: 'dashboard.dailySugar',
    defaultMessage: 'Daily Sugar',
  },
  dailySalt: {
    id: 'dashboard.dailySalt',
    defaultMessage: 'Daily Salt',
  },
  limits: {
    id: 'dashboard.limits',
    defaultMessage: 'Limits',
  },
  setLimits: {
    id: 'dashboard.setLimits',
    defaultMessage: 'Set Limits',
  },
  editLimits: {
    id: 'dashboard.editLimits',
    defaultMessage: 'Edit Limits',
  },
  limitsDescription: {
    id: 'dashboard.limitsDescription',
    defaultMessage: 'Set daily limits for tracking your nutrition goals',
  },
});

export const recordsMessages = defineMessages({
  title: {
    id: 'records.title',
    defaultMessage: 'Records',
  },
  entriesCount: {
    id: 'records.entriesCount',
    defaultMessage: '{count} entries',
  },
  addRecord: {
    id: 'records.addRecord',
    defaultMessage: 'Add Record',
  },
  newRecord: {
    id: 'records.newRecord',
    defaultMessage: 'New Record',
  },
  editRecord: {
    id: 'records.editRecord',
    defaultMessage: 'Edit Record',
  },
  meal: {
    id: 'records.meal',
    defaultMessage: 'Meal',
  },
  selectMeal: {
    id: 'records.selectMeal',
    defaultMessage: 'Select a meal',
  },
  category: {
    id: 'records.category',
    defaultMessage: 'Category',
  },
});

export const mealsMessages = defineMessages({
  title: {
    id: 'meals.title',
    defaultMessage: 'Meals',
  },
  savedMealsCount: {
    id: 'meals.savedMealsCount',
    defaultMessage: '{count} saved meals',
  },
  reusableNote: {
    id: 'meals.reusableNote',
    defaultMessage: 'Reusable when adding records',
  },
  addMeal: {
    id: 'meals.addMeal',
    defaultMessage: 'Add Meal',
  },
  newMeal: {
    id: 'meals.newMeal',
    defaultMessage: 'New Meal',
  },
  editMeal: {
    id: 'meals.editMeal',
    defaultMessage: 'Edit Meal',
  },
});
