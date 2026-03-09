import { useRef } from "react";
import { UILibConfiguration } from "../config/UILibConfiguration";
import type { DragMeta } from "../components/dnd/types";

const DRAG_THRESHOLD = 4;

export function useDraggable(meta: DragMeta) {
  const ref = useRef<HTMLDivElement>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const dragging = useRef(false);

  const onMouseDown = (e: React.MouseEvent) => {
    const { startDrag, endDrag } = UILibConfiguration.dragging;

    if (!startDrag || !endDrag) {
      console.warn(
        "[UILibConfiguration] dragging is not configured. Call UILibConfiguration.configureDragging() before using drag functionality.",
      );
      return;
    }

    e.preventDefault();
    startPos.current = { x: e.clientX, y: e.clientY };
    dragging.current = false;

    const onMouseMove = (e: MouseEvent) => {
      if (!startPos.current || dragging.current) return;
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
        dragging.current = true;
        startDrag(meta, ref as React.RefObject<HTMLElement>);
      }
    };

    const onMouseUp = () => {
      if (dragging.current) endDrag();
      dragging.current = false;
      startPos.current = null;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return { ref, onMouseDown };
}
