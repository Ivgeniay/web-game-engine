import {
  defaultNotificationSettings,
  type AppNotification,
  type NotificationSettings,
  type NotificationType,
} from "@proton/shared";

type NotificationHandler = (notifications: AppNotification[]) => void;

class NotificationServiceClass {
  private notifications: AppNotification[] = [];
  private handlers: Set<NotificationHandler> = new Set();
  private settings: NotificationSettings = { ...defaultNotificationSettings };
  private settingsHandlers: Set<(settings: NotificationSettings) => void> =
    new Set();

  push(notification: Omit<AppNotification, "id">): void {
    const id = crypto.randomUUID();
    const full: AppNotification = { ...notification, id };

    this.notifications = [
      ...this.notifications.slice(-(this.settings.maxCount - 1)),
      full,
    ];

    this.notify();

    const duration = notification.duration ?? this.settings.duration;
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  info(title: string, message?: string, duration?: number): void {
    this.push({ type: "info", title, message, duration });
  }

  success(title: string, message?: string, duration?: number): void {
    this.push({ type: "success", title, message, duration });
  }

  warning(title: string, message?: string, duration?: number): void {
    this.push({ type: "warning", title, message, duration });
  }

  error(title: string, message?: string, duration?: number): void {
    this.push({ type: "error", title, message, duration });
  }

  dismiss(id: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notify();
  }

  dismissAll(): void {
    this.notifications = [];
    this.notify();
  }

  applySettings(settings: NotificationSettings): void {
    this.settings = { ...settings };
    for (const handler of this.settingsHandlers) {
      handler(this.settings);
    }
  }

  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  on(handler: NotificationHandler): () => void {
    this.handlers.add(handler);
    handler(this.notifications);
    return () => this.handlers.delete(handler);
  }

  onSettings(handler: (settings: NotificationSettings) => void): () => void {
    this.settingsHandlers.add(handler);
    return () => this.settingsHandlers.delete(handler);
  }

  private notify(): void {
    for (const handler of this.handlers) {
      handler(this.notifications);
    }
  }
}

export const NotificationService = new NotificationServiceClass();
