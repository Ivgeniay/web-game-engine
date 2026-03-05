import { useEffect, useState } from "react";

type NotificationType = "info" | "warning" | "error" | "success";
type NotificationPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
}

interface NotificationsProps {
  position?: NotificationPosition;
  onDismiss: (id: string) => void;
  notifications: AppNotification[];
}

const positionClasses: Record<NotificationPosition, string> = {
  "top-left": "top-4 left-4 items-start",
  "top-right": "top-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-right": "bottom-4 right-4 items-end",
};

const typeClasses: Record<AppNotification["type"], string> = {
  info: "border-l-2 border-accent",
  success: "border-l-2 border-success",
  warning: "border-l-2 border-warning",
  error: "border-l-2 border-error",
};

const typeLabelClasses: Record<AppNotification["type"], string> = {
  info: "text-accent",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
};

const typeLabels: Record<AppNotification["type"], string> = {
  info: "Info",
  success: "Success",
  warning: "Warning",
  error: "Error",
};

interface NotificationItemProps {
  notification: AppNotification;
  onDismiss: (id: string) => void;
}

function NotificationItem({ notification, onDismiss }: NotificationItemProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`w-72 bg-secondary border border-default rounded shadow-lg px-3 py-2 flex flex-col gap-1 transition-all duration-200 ${
        typeClasses[notification.type]
      } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-xs font-bold select-none ${typeLabelClasses[notification.type]}`}
        >
          {typeLabels[notification.type]}
        </span>
        <span className="text-xs text-primary select-none flex-1">
          {notification.title}
        </span>
        <button
          className="text-xs text-disabled hover:text-primary transition-colors select-none shrink-0"
          onClick={() => onDismiss(notification.id)}
        >
          ✕
        </button>
      </div>
      {notification.message && (
        <span className="text-xs text-secondary select-none">
          {notification.message}
        </span>
      )}
    </div>
  );
}

export function Notifications({
  position = "bottom-right",
  notifications,
  onDismiss,
}: NotificationsProps) {
  return (
    <div
      className={`fixed flex flex-col gap-2 z-50 pointer-events-none ${positionClasses[position]}`}
    >
      {notifications.map((n) => (
        <div key={n.id} className="pointer-events-auto">
          <NotificationItem notification={n} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}
