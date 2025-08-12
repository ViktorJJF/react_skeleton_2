import type { NavigateFunction } from 'react-router-dom';

/**
 * Validates if a route exists in the application
 * This can be used to check if a route is valid before navigating
 */
export const isValidRoute = (path: string): boolean => {
  // Define valid routes in the application
  const validRoutes = [
    '/',
    '/dashboard',
    '/dashboard/analytics',
    '/assistants',
    '/agents',
    '/chatbots',
    '/conversations',
    '/bot-analytics',
    '/bot-training',
    '/chatbots-table',
    '/docs',
    '/pricing',
    '/profile',
    '/settings',
    '/settings/notifications',
    '/users',
    '/billing',
    '/api-keys',
    '/integrations',
    '/live-chat',
    '/leads',
    '/ecommerce',
    '/front-pages',
    '/calendar',
    '/kanban',
    '/chats',
    '/email',
    '/notes',
    '/contacts',
    '/invoice',
    '/elements/ui',
    '/elements/tables',
    '/elements/icons',
    '/login',
    '/register',
    '/forgot-password',
    '/404',
  ];

  return validRoutes.includes(path);
};

/**
 * Safely navigates to a route, redirecting to 404 if the route doesn't exist
 */
export const safeNavigate = (
  navigate: NavigateFunction,
  path: string,
): void => {
  if (isValidRoute(path)) {
    navigate(path);
  } else {
    navigate('/404');
  }
};

/**
 * Checks if a path should be treated as a 404
 */
export const isNotFoundPath = (path: string): boolean => {
  return path === '/404' || path === '*' || !isValidRoute(path);
};

/**
 * Extracts route parameters and validates them
 */
export const validateRouteParams = (
  params: Record<string, string | undefined>,
): boolean => {
  // Add validation logic for route parameters here
  // For example, check if IDs are valid UUIDs, etc.
  return Object.values(params).every(
    (param) => param !== undefined && param !== '',
  );
};
