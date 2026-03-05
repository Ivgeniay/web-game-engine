import { useEffect, useState } from "react";
import type { AppNotification, NotificationSettings } from "@proton/shared";
import { NotificationService } from "../services/NotificationService";

interface UseNotificationsResult {
  notifications: AppNotification[];
  settings: NotificationSettings;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

export function useNotifications(): UseNotificationsResult {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(
    NotificationService.getSettings(),
  );

  useEffect(() => {
    const unsubscribe = NotificationService.on(setNotifications);
    return unsubscribe;
  }, []);

  useEffect(() => {
    return NotificationService.onSettings(setSettings);
  }, []);

  return {
    notifications,
    settings,
    dismiss: (id) => NotificationService.dismiss(id),
    dismissAll: () => NotificationService.dismissAll(),
  };
}
