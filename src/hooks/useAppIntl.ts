import { useIntl } from 'react-intl';
import { commonMessages } from '@/locales/en';

export function useAppIntl() {
  const intl = useIntl();

  return {
    formatMessage: intl.formatMessage,
    common: commonMessages,
  };
}
