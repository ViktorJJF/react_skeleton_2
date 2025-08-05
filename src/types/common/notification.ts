export type NotificationType = "info" | "warning" | "error" | "success";

export interface Banner {
  id: string;
  type: NotificationType;
  message: string;
  icon?: React.ReactNode;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description?: string;
  date: string;
  read: boolean;
}
