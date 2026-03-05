import { useIntl } from 'react-intl';
import {
  commonMessages,
  dashboardMessages,
  recordsMessages,
  mealsMessages,
} from '@/locales/en';

export function useAppIntl() {
  const intl = useIntl();

  return {
    formatMessage: intl.formatMessage,
    common: commonMessages,
    dashboard: dashboardMessages,
    records: recordsMessages,
    meals: mealsMessages,
  };
}
