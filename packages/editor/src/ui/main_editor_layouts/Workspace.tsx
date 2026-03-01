import { EditorLayout } from "../components/EditorLayout";
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
            component: ScenePanel,
            position: { referencePanel: "scene", direction: "right" },
          },
          {
            id: "inspector",
            title: "Inspector",
            component: ScenePanel,
            position: { referencePanel: "hierarchy", direction: "below" },
          },
          // {
          //   id: "console",
          //   title: "Console",
          //   component: ScenePanel,
          //   position: { referencePanel: "scene", direction: "below" },
          // },
        ]}
      />
    </div>
  );
}
