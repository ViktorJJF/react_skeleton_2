import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface ErrorViewProps {
  error?: Error;
  errorInfo?: React.ErrorInfo;
  statusCode?: number;
}

const ErrorView: React.FC<ErrorViewProps> = ({
  error,
  errorInfo,
  statusCode = 500
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  const getErrorContent = () => {
    switch (statusCode) {
      case 404:
        return {
          title: t('errors.notFound'),
          description: t('errors.notFoundDescription'),
          icon: '🔍'
        };
      case 403:
        return {
          title: t('errors.forbidden'),
          description: t('errors.forbiddenDescription'),
          icon: '🚫'
        };
      case 500:
      default:
        return {
          title: t('errors.serverError'),
          description: t('errors.serverErrorDescription'),
          icon: '⚠️'
        };
    }
  };

  const errorContent = getErrorContent();

  const handleGoHome = () => {
    navigate(isAuthenticated ? '/dashboard' : '/login');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-100 dark:from-slate-900 dark:via-red-900/20 dark:to-orange-900/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              {/* Error Icon */}
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* Error Message */}
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  {errorContent.title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {errorContent.description}
                </p>
              </div>

              {/* Status Code */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('errors.statusCode')}: {statusCode}
                </p>
                {location.pathname && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('errors.attemptedPath', { path: location.pathname })}
                  </p>
                )}
              </div>

              {/* Development Error Details */}
              {process.env.NODE_ENV === 'development' && error && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-left">
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                    {t('errors.errorDetails')}
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                    {error.message}
                  </p>
                  {errorInfo && (
                    <details className="text-sm text-red-600 dark:text-red-400">
                      <summary className="cursor-pointer font-medium">
                        {t('errors.componentStack')}
                      </summary>
                      <pre className="mt-2 whitespace-pre-wrap text-xs">
                        {errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleGoHome} className="flex-1">
                  <Home className="w-4 h-4 mr-2" />
                  {t('errors.goHome')}
                </Button>
                <Button variant="outline" onClick={handleGoBack} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('errors.goBack')}
                </Button>
                <Button variant="outline" onClick={handleRefresh} className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('errors.refresh')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ErrorView; 