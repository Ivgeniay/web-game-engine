import { useEffect, useState } from "react";
import type { DockviewApi, SerializedDockview } from "dockview";
import { EditorLayout } from "../components/EditorLayout";
import { ScenePanel } from "../panels/scene_panel/ScenePanel";
import { HierarchyPanel } from "../panels/hierarchy_panel/HierarchyPanel";
import { InspectorPanel } from "../panels/inspector_panel/InspectorPanel";
import { ConsolePanel } from "../panels/console_panel/ConsolePanel";
import { SettingsPanel } from "../panels/settings_panel/SettingsPanel";
import { IndeterminateBarWithLabel } from "@proton/ui";
import { defaultWindowCoef } from "../../config/default_menu";
import { EditorLayoutService } from "../../services/EditorLayoutService";
import { useProjectStore } from "../../store/project_store";
import { client } from "../../api/client";
import { PersonalSettingsKeys } from "@proton/shared";
import { FileExplorerPanel } from "../panels/file_explorer_panel/FileExplorerPanel";

type LayoutState =
  | { status: "loading" }
  | { status: "ready"; layout: SerializedDockview | null };

export function Workspace() {
  const defCoef = defaultWindowCoef;
  const projectId = useProjectStore((state) => state.activeProject?.id);
  const [layoutState, setLayoutState] = useState<LayoutState>({
    status: "loading",
  });

  EditorLayoutService.registerComponent("scene", ScenePanel);
  EditorLayoutService.registerComponent("hierarchy", HierarchyPanel);
  EditorLayoutService.registerComponent("inspector", InspectorPanel);
  EditorLayoutService.registerComponent("console", ConsolePanel);
  EditorLayoutService.registerComponent("settings", SettingsPanel);
  EditorLayoutService.registerComponent("fileexplorer", FileExplorerPanel);

  useEffect(() => {
    if (!projectId) return;

    const load = async () => {
      try {
        const response = await client.get(
          `/projects/${projectId}/user-settings/${PersonalSettingsKeys.editorLayout}`,
        );

        if (response.ok) {
          const data = await response.json();
          const layout = JSON.parse(data.value) as SerializedDockview;
          setLayoutState({ status: "ready", layout });
        } else {
          setLayoutState({ status: "ready", layout: null });
        }
      } catch {
        setLayoutState({ status: "ready", layout: null });
      }
    };

    load();
  }, [projectId]);

  const saveLayout = async () => {
    if (!projectId) return;
    const layout = EditorLayoutService.serialize();
    if (!layout) return;
    await client.put(`/projects/${projectId}/user-settings`, {
      key: PersonalSettingsKeys.editorLayout,
      value: JSON.stringify(layout),
    });
  };

  const onReady = (dockviewApi: DockviewApi) => {
    EditorLayoutService.connect(dockviewApi);

    if (layoutState.status === "ready" && layoutState.layout) {
      EditorLayoutService.restore(layoutState.layout);
    } else {
      EditorLayoutService.openPanel({
        id: "scene",
        title: "Scene",
        component: ScenePanel,
        initialWidth: window.innerWidth * defCoef.SceneWidth,
        initialHeight: window.innerHeight * defCoef.SceneHeight,
      });

      EditorLayoutService.openPanel({
        id: "hierarchy",
        title: "Hierarchy",
        component: HierarchyPanel,
        position: { referencePanel: "scene", direction: "left" },
        initialWidth: window.innerWidth * defCoef.HierarchyWidth,
        initialHeight: window.innerHeight * defCoef.HierarchyHeight,
      });

      EditorLayoutService.openPanel({
        id: "inspector",
        title: "Inspector",
        component: InspectorPanel,
        position: { referencePanel: "scene", direction: "right" },
        initialWidth: window.innerWidth * defCoef.InspectorWidth,
        initialHeight: window.innerHeight * defCoef.InspectorHeight,
      });

      EditorLayoutService.openPanel({
        id: "console",
        title: "Console",
        component: ConsolePanel,
        position: { referencePanel: "scene", direction: "below" },
        initialWidth: window.innerWidth * defCoef.ConsoleWight,
        initialHeight: window.innerHeight * defCoef.ConsoleHeight,
      });
    }

    dockviewApi.onDidLayoutChange(() => {
      saveLayout();
    });
  };

  if (layoutState.status === "loading") {
    return <IndeterminateBarWithLabel label="Loading layout..." />;
  }

  return (
    <div className="flex-1 overflow-hidden">
      <EditorLayout onReady={onReady} class_="w-full h-full" />
    </div>
  );
}
