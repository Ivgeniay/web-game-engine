import { useRef, useState, useEffect } from "react";
import type { DropAccepts, DragMeta } from "../components/dnd/types";
import { checkDrop } from "../components/dnd/checkDrop";
import { UILibConfiguration } from "../config/UILibConfiguration";

export function useDropZone(
  accepts: DropAccepts,
  onDrop?: (source: DragMeta) => void,
) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const cachedMeta = useRef<DragMeta | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleEnter = () => {
      const { getDragMeta } = UILibConfiguration.dropping;
      if (!getDragMeta) {
        console.warn(
          "[UILibConfiguration] dropping is not configured. Call UILibConfiguration.configureDropping() before using drop functionality.",
        );
        return;
      }
      const meta = getDragMeta();
      if (checkDrop(meta, accepts)) {
        cachedMeta.current = meta;
        setIsDragOver(true);
      }
    };

    const handleLeave = () => {
      cachedMeta.current = null;
      setIsDragOver(false);
    };

    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [accepts]);

  useEffect(() => {
    if (!isDragOver) return;

    const handleMouseUp = () => {
      if (cachedMeta.current) onDrop?.(cachedMeta.current);
      cachedMeta.current = null;
      setIsDragOver(false);
    };

    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [isDragOver, onDrop]);

  return { ref, isDragOver };
}
