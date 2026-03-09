import type {
  IInput,
  MouseButton,
  KeyHandler,
  MouseButtonHandler,
  MouseMoveHandler,
  MouseWheelHandler,
  TouchHandler,
} from "./IInput";

const MOUSE_BUTTON_MAP: Record<number, MouseButton> = {
  0: "left",
  1: "middle",
  2: "right",
};

type HandlerSet<T> = Set<T>;

export class BrowserInput implements IInput {
  private keys: Set<string> = new Set();
  private mouse = {
    x: 0,
    y: 0,
    deltaX: 0,
    deltaY: 0,
    buttons: new Set<MouseButton>(),
  };

  private handlers = {
    keyDown: new Set<KeyHandler>(),
    keyUp: new Set<KeyHandler>(),
    mouseDown: new Set<MouseButtonHandler>(),
    mouseUp: new Set<MouseButtonHandler>(),
    mouseMove: new Set<MouseMoveHandler>(),
    mouseWheel: new Set<MouseWheelHandler>(),
    touchStart: new Set<TouchHandler>(),
    touchMove: new Set<TouchHandler>(),
    touchEnd: new Set<TouchHandler>(),
  };

  private subscribe<T>(set: HandlerSet<T>, handler: T): () => void {
    set.add(handler);
    return () => set.delete(handler);
  }

  init(): void {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mousedown", this.handleMouseDown);
    window.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("wheel", this.handleWheel);
    window.addEventListener("touchstart", this.handleTouchStart);
    window.addEventListener("touchmove", this.handleTouchMove);
    window.addEventListener("touchend", this.handleTouchEnd);
    window.addEventListener("blur", this.handleBlur);
  }

  destroy(): void {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mousedown", this.handleMouseDown);
    window.removeEventListener("mouseup", this.handleMouseUp);
    window.removeEventListener("wheel", this.handleWheel);
    window.removeEventListener("touchstart", this.handleTouchStart);
    window.removeEventListener("touchmove", this.handleTouchMove);
    window.removeEventListener("touchend", this.handleTouchEnd);
    window.removeEventListener("blur", this.handleBlur);
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    this.keys.add(e.code);
    this.handlers.keyDown.forEach((h) => h(e.code));
  };

  private handleKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.code);
    this.handlers.keyUp.forEach((h) => h(e.code));
  };

  private handleMouseMove = (e: MouseEvent): void => {
    this.mouse.deltaX = e.clientX - this.mouse.x;
    this.mouse.deltaY = e.clientY - this.mouse.y;
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    this.handlers.mouseMove.forEach((h) =>
      h(this.mouse.x, this.mouse.y, this.mouse.deltaX, this.mouse.deltaY),
    );
  };

  private handleMouseDown = (e: MouseEvent): void => {
    const btn = MOUSE_BUTTON_MAP[e.button];
    if (!btn) return;
    this.mouse.buttons.add(btn);
    this.handlers.mouseDown.forEach((h) => h(btn));
  };

  private handleMouseUp = (e: MouseEvent): void => {
    const btn = MOUSE_BUTTON_MAP[e.button];
    if (!btn) return;
    this.mouse.buttons.delete(btn);
    this.handlers.mouseUp.forEach((h) => h(btn));
  };

  private handleWheel = (e: WheelEvent): void => {
    this.handlers.mouseWheel.forEach((h) => h(e.deltaY));
  };

  private handleTouchStart = (e: TouchEvent): void => {
    this.handlers.touchStart.forEach((h) => h(e.touches));
  };

  private handleTouchMove = (e: TouchEvent): void => {
    this.handlers.touchMove.forEach((h) => h(e.touches));
  };

  private handleTouchEnd = (e: TouchEvent): void => {
    this.handlers.touchEnd.forEach((h) => h(e.changedTouches));
  };

  private handleBlur = (): void => {
    this.keys.clear();
    this.mouse.buttons.clear();
  };

  isKeyDown(code: string): boolean {
    return this.keys.has(code);
  }

  isMouseDown(button: MouseButton = "left"): boolean {
    return this.mouse.buttons.has(button);
  }

  getMousePosition(): { x: number; y: number } {
    return { x: this.mouse.x, y: this.mouse.y };
  }

  getMouseDelta(): { x: number; y: number } {
    return { x: this.mouse.deltaX, y: this.mouse.deltaY };
  }

  isCtrl(): boolean {
    return this.keys.has("ControlLeft") || this.keys.has("ControlRight");
  }

  isShift(): boolean {
    return this.keys.has("ShiftLeft") || this.keys.has("ShiftRight");
  }

  isAlt(): boolean {
    return this.keys.has("AltLeft") || this.keys.has("AltRight");
  }

  onKeyDown(handler: KeyHandler): () => void {
    return this.subscribe(this.handlers.keyDown, handler);
  }

  onKeyUp(handler: KeyHandler): () => void {
    return this.subscribe(this.handlers.keyUp, handler);
  }

  onMouseDown(handler: MouseButtonHandler): () => void {
    return this.subscribe(this.handlers.mouseDown, handler);
  }

  onMouseUp(handler: MouseButtonHandler): () => void {
    return this.subscribe(this.handlers.mouseUp, handler);
  }

  onMouseMove(handler: MouseMoveHandler): () => void {
    return this.subscribe(this.handlers.mouseMove, handler);
  }

  onMouseWheel(handler: MouseWheelHandler): () => void {
    return this.subscribe(this.handlers.mouseWheel, handler);
  }

  onTouchStart(handler: TouchHandler): () => void {
    return this.subscribe(this.handlers.touchStart, handler);
  }

  onTouchMove(handler: TouchHandler): () => void {
    return this.subscribe(this.handlers.touchMove, handler);
  }

  onTouchEnd(handler: TouchHandler): () => void {
    return this.subscribe(this.handlers.touchEnd, handler);
  }
}
