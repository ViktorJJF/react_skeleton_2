import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { trackPageView } from '@/utils/analytics';

const RootLayout = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return <Outlet />;
};

export default RootLayout; 