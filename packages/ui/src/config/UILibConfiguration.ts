import type { DragMeta, DropAccepts } from "../components/dnd/types";

interface DraggingConfiguration {
  startDrag?: (meta: DragMeta, ref: React.RefObject<HTMLElement>) => void;
  endDrag?: () => void;
}

interface DroppingConfiguration {
  getDragMeta?: () => DragMeta | null;
}

class UILibConfigurationClass {
  dragging: DraggingConfiguration = {};
  dropping: DroppingConfiguration = {};

  configureDragging(config: Required<DraggingConfiguration>): void {
    this.dragging = config;
  }

  configureDropping(config: Required<DroppingConfiguration>): void {
    this.dropping = config;
  }
}

export const UILibConfiguration = new UILibConfigurationClass();
