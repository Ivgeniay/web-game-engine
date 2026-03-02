import { useRef } from "react";
import { SceneHeader } from "./SceneHeader";
import { ScenePanelToolbar } from "./ScenePanelToolbar";

export function ScenePanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="flex flex-col w-full h-full">
      <SceneHeader />
      <div className="relative flex-1 overflow-hidden">
        Scene content
        <canvas ref={canvasRef} className="w-full h-full" />
        <ScenePanelToolbar />
      </div>
    </div>
  );
}
