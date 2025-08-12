import ReactGA from 'react-ga4';
import config from '@/config';

const isProduction = process.env.NODE_ENV === 'production';

export const initGA = () => {
  if (isProduction && config.GA_MEASUREMENT_ID) {
    ReactGA.initialize(config.GA_MEASUREMENT_ID);
  }
};

export const trackPageView = (path: string) => {
  if (isProduction) {
    ReactGA.send({ hitType: 'pageview', page: path });
  }
};

export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number,
) => {
  if (isProduction) {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
  }
};
