import { Header } from "./Header";
import { Workspace } from "./Workspace";
import { Footer } from "./Footer";
import { useMenuStore } from "../../store/menu_store";
import { defaultEditorMenu } from "../../config/default_menu";
import { useEffect } from "react";
import { useProjectStore } from "../../store/project_store";
import { useUserStore } from "../../store/user_store";
import { WsService } from "../../services/WsService";
import { NotificationService } from "../../services/NotificationService";
import { Notifications } from "@proton/ui";
import { useNotifications } from "../../hooks/useNotifications";
import { WsEventName } from "@proton/shared";

export function UIEditor() {
  const registerBar = useMenuStore((state) => state.registerBar);
  const unregisterBar = useMenuStore((state) => state.unregisterBar);
  const projectId = useProjectStore((state) => state.activeProject?.id);
  const token = useUserStore((state) => state.token);
  const { notifications, settings, dismiss } = useNotifications();

  useEffect(() => {
    registerBar(defaultEditorMenu);
    return () => unregisterBar(defaultEditorMenu.id);
  }, []);

  useEffect(() => {
    if (!projectId || !token) return;
    WsService.connect(projectId, token);
    return () => WsService.disconnect();
  }, [projectId, token]);

  useEffect(() => {
    WsService.on(WsEventName.userJoined, (event) => {
      NotificationService.info(
        "User joined",
        `${event.username} joined the project`,
      );
    });

    WsService.on(WsEventName.userLeft, (event) => {
      NotificationService.info(
        "User left",
        `${event.username} left the project`,
      );
    });
  }, []);

  return (
    <div className="flex flex-col w-screen h-screen bg-primary overflow-hidden">
      <Header />
      <Workspace />
      <Footer />
      <Notifications
        notifications={notifications}
        position={settings.position}
        onDismiss={dismiss}
      />
    </div>
  );
}
