import { useToast } from "@/hooks/use-toast";
import { useNotificationStore } from "@/store/notificationStore";
import type {
  Banner,
  Notification,
  NotificationType,
} from "@/types/common/notification";
import { useCallback } from "react";

type ToastPayload = {
  title: string;
  description?: string;
};

type NotificationPayload = Omit<Notification, "id" | "date" | "read">;
type BannerPayload = Omit<Banner, "id">;

export const useNotifications = () => {
  const { toast } = useToast();
  const { addNotification, addBanner } = useNotificationStore();

  const sendToast = useCallback(
    (type: NotificationType, payload: ToastPayload) => {
      toast({
        variant: type === "error" ? "destructive" : "default",
        title: payload.title,
        description: payload.description,
      });
    },
    [toast]
  );

  const sendBanner = useCallback(
    (payload: BannerPayload) => {
      addBanner(payload);
    },
    [addBanner]
  );

  const sendNotification = useCallback(
    (payload: NotificationPayload) => {
      addNotification(payload);
    },
    [addNotification]
  );

  return { sendToast, sendBanner, sendNotification };
};
