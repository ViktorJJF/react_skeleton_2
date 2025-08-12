import { create } from 'zustand';
import type { Banner, Notification } from '@/types/common/notification';
import { v4 as uuidv4 } from 'uuid';

interface NotificationState {
  banners: Banner[];
  notifications: Notification[];
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  removeBanner: (id: string) => void;
  addNotification: (
    notification: Omit<Notification, 'id' | 'date' | 'read'>,
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  banners: [],
  notifications: [],

  addBanner: (banner) =>
    set((state) => ({
      banners: [...state.banners, { ...banner, id: uuidv4() }],
    })),

  removeBanner: (id) =>
    set((state) => ({
      banners: state.banners.filter((banner) => banner.id !== id),
    })),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: uuidv4(),
          date: new Date().toISOString(),
          read: false,
        },
        ...state.notifications,
      ],
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  clearNotifications: () => set({ notifications: [] }),
}));
