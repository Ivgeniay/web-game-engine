import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Input } from "@proton/engine";
import { useEditorStore } from "../../store/editor_store";

export function DragOverlay(): React.ReactElement | null {
  const dragMeta = useEditorStore((s) => s.dragMeta);
  const dragSource = useEditorStore((s) => s.dragSource);
  const endDrag = useEditorStore((s) => s.endDrag);

  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const cloneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dragMeta) {
      setPos(null);
      return;
    }

    const initial = Input.getMousePosition();
    setPos({ x: initial.x, y: initial.y });

    const unsubMove = Input.onMouseMove((x, y) => {
      setPos({ x, y });
    });

    const unsubUp = Input.onMouseUp(() => {
      endDrag();
    });

    return () => {
      unsubMove();
      unsubUp();
    };
  }, [dragMeta, endDrag]);

  useEffect(() => {
    if (!dragMeta || !dragSource?.current || !cloneRef.current) return;
    const clone = dragSource.current.cloneNode(true) as HTMLElement;
    clone.style.pointerEvents = "none";
    cloneRef.current.innerHTML = "";
    cloneRef.current.appendChild(clone);
  }, [dragMeta, dragSource]);

  if (!dragMeta) return null;

  return createPortal(
    <div
      ref={cloneRef}
      style={{
        position: "fixed",
        left: (pos?.x ?? 0) + 12,
        top: (pos?.y ?? 0) + 12,
        opacity: 0.7,
        pointerEvents: "none",
        zIndex: 9999,
        visibility: pos ? "visible" : "hidden",
      }}
    />,
    document.body,
  );
}
