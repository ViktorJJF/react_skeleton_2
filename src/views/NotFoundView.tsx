import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const NotFoundView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  const handleGoHome = () => {
    navigate(isAuthenticated ? '/dashboard' : '/login');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSearch = () => {
    // You could implement a search functionality here
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              {/* 404 Icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                    <HelpCircle className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-yellow-900">
                    4
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-yellow-900">
                    4
                  </div>
                </div>
              </div>

              {/* Error Message */}
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  {t('errors.notFound')}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {t('errors.notFoundDescription')}
                </p>
              </div>

              {/* Attempted Path */}
              {location.pathname !== '/404' && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('errors.attemptedPath', { path: location.pathname })}
                  </p>
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
              </div>

              {/* Search Option */}
              <Button variant="ghost" onClick={handleSearch} className="w-full">
                <Search className="w-4 h-4 mr-2" />
                {t('common.search')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFoundView; 