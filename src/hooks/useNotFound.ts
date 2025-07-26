import { useNavigate } from "react-router-dom";

interface UseNotFoundReturn {
  throwNotFound: (message?: string) => void;
  redirectToNotFound: () => void;
  isNotFoundPath: (path: string) => boolean;
}

/**
 * Custom hook for handling 404 Not Found errors
 * Provides utilities for programmatically handling 404 scenarios
 */
export const useNotFound = (): UseNotFoundReturn => {
  const navigate = useNavigate();

  /**
   * Throws a 404 error that will be caught by the ErrorBoundary
   */
  const throwNotFound = (message: string = "Page not found") => {
    const error = new Error(message);
    error.name = "NotFoundError";
    throw error;
  };

  /**
   * Redirects to the 404 page
   */
  const redirectToNotFound = () => {
    navigate("/404", { replace: true });
  };

  /**
   * Checks if a given path is a 404 path
   */
  const isNotFoundPath = (path: string): boolean => {
    return path === "/404" || path === "*";
  };

  return {
    throwNotFound,
    redirectToNotFound,
    isNotFoundPath,
  };
};
