import { useState, useRef } from "react";

export function ScenePanelToolbar() {
  const [position, setPosition] = useState({ x: 8, y: 8 });
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };

    const onMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      className="absolute bg-secondary border border-default rounded shadow-lg cursor-move select-none"
      style={{ left: position.x, top: position.y }}
      onMouseDown={onMouseDown}
    >
      <div className="flex items-center gap-1 px-2 py-1">
        <button
          className="px-2 py-0.5 text-xs text-primary hover:bg-hover rounded transition-colors"
          onClick={() => console.log("Move clicked")}
        >
          Move
        </button>
        <button
          className="px-2 py-0.5 text-xs text-primary hover:bg-hover rounded transition-colors"
          onClick={() => console.log("Rotate clicked")}
        >
          Rotate
        </button>
        <button
          className="px-2 py-0.5 text-xs text-primary hover:bg-hover rounded transition-colors"
          onClick={() => console.log("Scale clicked")}
        >
          Scale
        </button>
      </div>
    </div>
  );
}
