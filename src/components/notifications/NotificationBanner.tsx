import React from 'react';
import { useNotificationStore } from '@/store/notificationStore';
import { Button } from '@/components/ui/button';
import { X, Info, AlertTriangle, CheckCircle, Bell } from 'lucide-react';
import type { NotificationType } from '@/types/common/notification';

const bannerIcons: Record<NotificationType, React.ReactNode> = {
  info: <Info className="w-5 h-5" />,
  success: <CheckCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  error: <Bell className="w-5 h-5" />, // Or another appropriate icon
};

const bannerStyles: Record<NotificationType, string> = {
  info: 'bg-blue-500 text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-black',
  error: 'bg-red-500 text-white',
};

const NotificationBanner: React.FC = () => {
  const { banners, removeBanner } = useNotificationStore();

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {banners.map((banner) => (
        <div 
          key={banner.id} 
          className={`flex items-center justify-between p-3 ${bannerStyles[banner.type]}`}
        >
          <div className="flex items-center">
            {banner.icon || bannerIcons[banner.type]}
            <span className="ml-3 font-medium">{banner.message}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeBanner(banner.id)}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default NotificationBanner; 