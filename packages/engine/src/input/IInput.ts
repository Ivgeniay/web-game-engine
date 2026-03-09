export type MouseButton = "left" | "middle" | "right";
export type KeyHandler = (code: string) => void;
export type MouseButtonHandler = (button: MouseButton) => void;
export type MouseMoveHandler = (
  x: number,
  y: number,
  deltaX: number,
  deltaY: number,
) => void;
export type MouseWheelHandler = (deltaY: number) => void;
export type TouchHandler = (touches: TouchList) => void;

export interface IInput {
  init(): void;
  destroy(): void;

  isKeyDown(code: string): boolean;
  isMouseDown(button?: MouseButton): boolean;

  getMousePosition(): { x: number; y: number };
  getMouseDelta(): { x: number; y: number };

  isCtrl(): boolean;
  isShift(): boolean;
  isAlt(): boolean;

  onKeyDown(handler: KeyHandler): () => void;
  onKeyUp(handler: KeyHandler): () => void;
  onMouseDown(handler: MouseButtonHandler): () => void;
  onMouseUp(handler: MouseButtonHandler): () => void;
  onMouseMove(handler: MouseMoveHandler): () => void;
  onMouseWheel(handler: MouseWheelHandler): () => void;
  onTouchStart(handler: TouchHandler): () => void;
  onTouchMove(handler: TouchHandler): () => void;
  onTouchEnd(handler: TouchHandler): () => void;
}
