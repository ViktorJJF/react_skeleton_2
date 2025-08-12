import { trackEvent } from '@/utils/analytics';

export const useAnalytics = () => {
  const trackCustomEvent = (
    category: string,
    action: string,
    label?: string,
    value?: number,
  ) => {
    trackEvent(category, action, label, value);
  };

  return { trackCustomEvent };
};
