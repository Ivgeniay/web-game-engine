export type NotificationType = "info" | "warning" | "error" | "success";

export type NotificationPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

export interface NotificationSettings {
  position: NotificationPosition;
  duration: number;
  maxCount: number;
}

export const defaultNotificationSettings: NotificationSettings = {
  position: "bottom-right",
  duration: 4000,
  maxCount: 5,
};
