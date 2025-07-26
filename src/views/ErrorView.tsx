import React from 'react';
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
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const getErrorMessage = () => {
    switch (statusCode) {
      case 404:
        return {
          title: 'Page Not Found',
          description: 'The page you are looking for doesn\'t exist or has been moved.',
          icon: '🔍'
        };
      case 403:
        return {
          title: 'Access Forbidden',
          description: 'You don\'t have permission to access this resource.',
          icon: '🚫'
        };
      case 500:
        return {
          title: 'Internal Server Error',
          description: 'Something went wrong on our end. Please try again later.',
          icon: '⚠️'
        };
      default:
        return {
          title: 'Something Went Wrong',
          description: 'An unexpected error occurred. Please try again.',
          icon: '❌'
        };
    }
  };

  const errorDetails = getErrorMessage();

  const handleGoHome = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="p-8 text-center">
          {/* Error Icon */}
          <div className="mb-6">
            <div className="text-6xl mb-4">{errorDetails.icon}</div>
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
          </div>

          {/* Error Status */}
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-red-600 mb-2">
              {statusCode}
            </h1>
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">
              {errorDetails.title}
            </h2>
            <p className="text-slate-600">
              {errorDetails.description}
            </p>
          </div>

          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === 'development' && error && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg text-left">
              <h3 className="font-semibold text-red-800 mb-2">Error Details:</h3>
              <p className="text-sm text-red-700 mb-2">{error.message}</p>
              {error.stack && (
                <details className="text-xs text-red-600">
                  <summary className="cursor-pointer">Stack Trace</summary>
                  <pre className="mt-2 whitespace-pre-wrap">{error.stack}</pre>
                </details>
              )}
            </div>
          )}

          {/* Current Path Info */}
          <div className="mb-6 p-3 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Error occurred at:</p>
            <p className="text-sm font-mono text-slate-700 break-all">
              {location.pathname}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleRefresh} 
              className="w-full"
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button 
              onClick={handleGoHome} 
              variant="outline" 
              className="w-full"
              size="lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
            
            <Button 
              onClick={handleGoBack} 
              variant="ghost" 
              className="w-full"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-2">
              If this problem persists, please contact support.
            </p>
            <p className="text-xs text-slate-400">
              Error ID: {Date.now().toString(36)}-{Math.random().toString(36).substr(2, 9)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorView; 