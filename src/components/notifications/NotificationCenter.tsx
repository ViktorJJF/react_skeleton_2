import React from 'react';
import { useNotificationStore } from '@/store/notificationStore';
import { Button } from '@/components/ui/button';
import { Bell, Check, Trash2, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Notification, NotificationType } from '@/types/notification';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  info: <Info className="w-4 h-4 text-blue-500" />,
  success: <CheckCircle className="w-4 h-4 text-green-500" />,
  warning: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
  error: <AlertTriangle className="w-4 h-4 text-red-500" />,
};

const NotificationCenter: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotificationStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 justify-center rounded-full p-1"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2 flex justify-between items-center">
          <h3 className="font-semibold">Notifications</h3>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              You have no new notifications.
            </div>
          ) : (
            notifications.map((notification: Notification) => (
              <DropdownMenuItem
                key={notification.id}
                onSelect={() => markAsRead(notification.id)}
                className={`flex items-start gap-3 p-3 ${!notification.read ? 'bg-blue-50' : ''}`}
              >
                <div className="mt-1">
                  {notificationIcons[notification.type]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                  </p>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={clearNotifications}
              className="flex items-center justify-center p-2 text-red-500"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationCenter; 