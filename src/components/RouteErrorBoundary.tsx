import React from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import ErrorView from '@/views/ErrorView';

const RouteErrorBoundary: React.FC = () => {
  const routeError = useRouteError();

  let statusCode = 500;
  let error: Error | undefined;

  if (isRouteErrorResponse(routeError)) {
    statusCode = routeError.status;
    error = new Error(routeError.statusText || 'Route Error');
  } else if (routeError instanceof Error) {
    error = routeError;
  } else if (routeError) {
    error = new Error(String(routeError));
  }

  return <ErrorView error={error} statusCode={statusCode} />;
};

export default RouteErrorBoundary;


