import type { DockviewApi, SerializedDockview } from "dockview";
import { EditorLayout } from "../components/EditorLayout";
import { ScenePanel } from "../panels/scene_panel/ScenePanel";
import { HierarchyPanel } from "../panels/hierarchy_panel/HierarchyPanel";
import { InspectorPanel } from "../panels/inspector_panel/InspectorPanel";
import { ConsolePanel } from "../panels/console_panel/ConsolePanel";
import { defaultWindowCoef } from "../../config/default_menu";
import { useState } from "react";
import { Debug, MessageStyle } from "@proton/engine";

export function Workspace() {
  const defCoef = defaultWindowCoef;

  let [state, setState] = useState<SerializedDockview | null>(null);

  const onReady = (api: DockviewApi) => {
    const scene = api.addPanel({
      id: "scene",
      component: "content",
      title: "Scene",
      params: { component: ScenePanel },
      initialWidth: window.innerWidth * defCoef.SceneWidth,
      initialHeight: window.innerHeight * defCoef.SceneHeight,
    });

    const hierarchy = api.addPanel({
      id: "hierarchy",
      component: "content",
      title: "Hierarchy",
      params: { component: HierarchyPanel },
      position: { referencePanel: "scene", direction: "left" },
      initialWidth: window.innerWidth * defCoef.HierarchyWidth,
      initialHeight: window.innerHeight * defCoef.HierarchyHeight,
    });

    api.addPanel({
      id: "inspector",
      component: "content",
      title: "Inspector",
      params: { component: InspectorPanel },
      position: { referencePanel: "scene", direction: "right" },
      initialWidth: window.innerWidth * defCoef.InspectorWidth,
      initialHeight: window.innerHeight * defCoef.InspectorHeight,
    });

    api.addPanel({
      id: "console",
      component: "content",
      title: "Console",
      params: { component: ConsolePanel },
      position: { direction: "below" },
      initialWidth: window.innerWidth * defCoef.ConsoleWight,
      initialHeight: window.innerHeight * defCoef.ConsoleHeight,
    });

    api.onDidLayoutChange((e) => {
      setState(api.toJSON());
    });
    api.onDidActivePanelChange((panel) => {
      setState(api.toJSON());
    });
  };

  const restore = function () {
    Debug.Info(
      JSON.stringify(state),
      MessageStyle.Bold | MessageStyle.Italic | MessageStyle.JsonHighlight,
    );
  };

  return (
    <div className="flex-1 overflow-hidden">
      <EditorLayout onReady={onReady} class_="w-full h-full" />
      <button onClick={restore}>RESTORE</button>
    </div>
  );
}
