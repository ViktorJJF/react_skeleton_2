import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const NotFoundView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

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

  const handleSearch = () => {
    // You can implement a search functionality here
    // For now, just navigate to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          {/* 404 Number */}
          <div className="mb-6">
            <h1 className="text-8xl font-bold text-slate-200 select-none">404</h1>
          </div>

          {/* Main Message */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">
              Page Not Found
            </h2>
            <p className="text-slate-600">
              Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Current Path Info */}
          <div className="mb-6 p-3 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Attempted to access:</p>
            <p className="text-sm font-mono text-slate-700 break-all">
              {location.pathname}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleGoHome} 
              className="w-full"
              size="lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
            
            <Button 
              onClick={handleGoBack} 
              variant="outline" 
              className="w-full"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>

            <Button 
              onClick={handleSearch} 
              variant="ghost" 
              className="w-full"
              size="lg"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-center text-slate-500 mb-2">
              <HelpCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">Need help?</span>
            </div>
            <p className="text-xs text-slate-400">
              Contact support or check our documentation for assistance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundView; 