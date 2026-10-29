import type { DragData } from '@/contracts/dragData';

export interface DragPoint {
  readonly clientX: number;
  readonly clientY: number;
}

export interface DropTargetHandlers {
  readonly accepts: readonly string[];
  readonly onDragOver: (data: DragData, point: DragPoint) => boolean;
  readonly onDragLeave?: (() => void) | undefined;
  readonly onDrop: (data: DragData, point: DragPoint) => void;
}

export interface DragSession {
  readonly data: DragData;
  readonly point: DragPoint;
  readonly targetId: string | null;
  readonly allowed: boolean;
}
