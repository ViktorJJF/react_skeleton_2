# In-App Notification System

This document outlines the in-app notification system, which provides various ways to communicate with users within the application.

## Overview

The notification system is composed of three main parts:
1.  **Toast Notifications**: For non-blocking, short-lived feedback (e.g., success, error).
2.  **Banner Notifications**: For app-wide, important announcements.
3.  **Notification Center**: A persistent history of important notifications accessible from the header.

The entire system is managed by a centralized Zustand store (`src/store/notificationStore.ts`) and is accessed through a unified `useNotifications` hook.

## Components

### `NotificationBanner.tsx`
- **Location**: `src/components/notifications/NotificationBanner.tsx`
- **Description**: Displays a full-width banner at the top of the page. It's rendered within the `AdminLayout` to be globally visible.
- **Features**: Supports different notification types (`info`, `success`, `warning`, `error`) with corresponding styles and icons.

### `NotificationCenter.tsx`
- **Location**: `src/components/notifications/NotificationCenter.tsx`
- **Description**: A dropdown menu in the header, triggered by a bell icon. It lists persistent notifications.
- **Features**:
    - Shows an unread count badge.
    - Allows marking individual or all notifications as read.
    - Allows clearing all notifications.
    - Displays timestamps for each notification.

## State Management

### `notificationStore.ts`
- **Location**: `src/store/notificationStore.ts`
- **Description**: A Zustand store that manages the state for `banners` and `notifications`.
- **Actions**:
    - `addBanner`, `removeBanner`
    - `addNotification`, `markAsRead`, `markAllAsRead`, `clearNotifications`

## Usage

The primary way to interact with the notification system is through the `useNotifications` hook.

### `useNotifications.ts`
- **Location**: `src/hooks/useNotifications.ts`
- **Description**: A hook that provides a simple API to send any type of notification.

#### **Sending a Toast Notification**
Toasts are ideal for feedback on user actions.

```javascript
import { useNotifications } from '@/hooks/useNotifications';

const { sendToast } = useNotifications();

sendToast('success', {
  title: 'Action Successful',
  description: 'Your changes have been saved.',
});
```

#### **Sending a Banner Notification**
Banners are for high-priority, app-wide messages.

```javascript
import { useNotifications } from '@/hooks/useNotifications';

const { sendBanner } = useNotifications();

sendBanner({
  type: 'warning',
  message: 'System maintenance is scheduled for tonight at 11 PM EST.',
});
```

#### **Sending a Persistent Notification**
These notifications appear in the Notification Center and are for important, non-urgent information.

```javascript
import { useNotifications } from '@/hooks/useNotifications';

const { sendNotification } = useNotifications();

sendNotification({
  type: 'info',
  title: 'New Feature Alert!',
  description: 'We\'ve added a new analytics dashboard for you to explore.',
});
```

## Types

All notification-related types are defined in `src/types/notification.ts`. This includes interfaces for `Notification` and `Banner`, as well as the `NotificationType` enum.

## Example Implementation

The `DashboardView.tsx` component includes a demonstration of how to use the `useNotifications` hook to dispatch all three types of notifications when the component mounts. This serves as a practical example of the system's usage. 