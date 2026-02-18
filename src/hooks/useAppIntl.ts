import { useIntl } from 'react-intl';
import {
  commonMessages,
  navMessages,
  dashboardMessages,
  recordsMessages,
  mealsMessages,
} from '@/locales/en';

export function useAppIntl() {
  const intl = useIntl();

  return {
    formatMessage: intl.formatMessage,
    common: commonMessages,
    nav: navMessages,
    dashboard: dashboardMessages,
    records: recordsMessages,
    meals: mealsMessages,
  };
}
