import { EditorLayout } from "../components/EditorLayout";
import { ConsolePanel } from "../panels/console_panel/ConsolePanel";
import { HierarchyPanel } from "../panels/hierarchy_panel/HierarchyPanel";
import { InspectorPanel } from "../panels/inspector_panel/InspectorPanel";
import { ScenePanel } from "../panels/scene_panel/ScenePanel";

export function Workspace() {
  return (
    <div className="flex-1 overflow-hidden">
      <EditorLayout
        panels={[
          {
            id: "scene",
            title: "Scene",
            component: ScenePanel,
          },
          {
            id: "hierarchy",
            title: "Hierarchy",
            component: HierarchyPanel,
            position: { referencePanel: "scene", direction: "right" },
          },
          {
            id: "inspector",
            title: "Inspector",
            component: InspectorPanel,
            position: { referencePanel: "hierarchy", direction: "below" },
          },
          {
            id: "console",
            title: "Console",
            component: ConsolePanel,
            position: { referencePanel: "scene", direction: "below" },
          },
        ]}
      />
    </div>
  );
}
