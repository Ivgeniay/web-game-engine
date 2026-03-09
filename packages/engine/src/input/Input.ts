import type {
  IInput,
  MouseButton,
  KeyHandler,
  MouseButtonHandler,
  MouseMoveHandler,
  MouseWheelHandler,
  TouchHandler,
} from "./IInput";

class InputManager {
  private provider: IInput | null = null;

  setProvider(provider: IInput): void {
    if (this.provider) this.provider.destroy();
    this.provider = provider;
    this.provider.init();
  }

  private get(): IInput {
    if (!this.provider) throw new Error("Input provider is not set");
    return this.provider;
  }

  isKeyDown(code: string): boolean {
    return this.get().isKeyDown(code);
  }
  isMouseDown(button?: MouseButton): boolean {
    return this.get().isMouseDown(button);
  }
  getMousePosition(): { x: number; y: number } {
    return this.get().getMousePosition();
  }
  getMouseDelta(): { x: number; y: number } {
    return this.get().getMouseDelta();
  }
  isCtrl(): boolean {
    return this.get().isCtrl();
  }
  isShift(): boolean {
    return this.get().isShift();
  }
  isAlt(): boolean {
    return this.get().isAlt();
  }

  onKeyDown(handler: KeyHandler): () => void {
    return this.get().onKeyDown(handler);
  }
  onKeyUp(handler: KeyHandler): () => void {
    return this.get().onKeyUp(handler);
  }
  onMouseDown(handler: MouseButtonHandler): () => void {
    return this.get().onMouseDown(handler);
  }
  onMouseUp(handler: MouseButtonHandler): () => void {
    return this.get().onMouseUp(handler);
  }
  onMouseMove(handler: MouseMoveHandler): () => void {
    return this.get().onMouseMove(handler);
  }
  onMouseWheel(handler: MouseWheelHandler): () => void {
    return this.get().onMouseWheel(handler);
  }
  onTouchStart(handler: TouchHandler): () => void {
    return this.get().onTouchStart(handler);
  }
  onTouchMove(handler: TouchHandler): () => void {
    return this.get().onTouchMove(handler);
  }
  onTouchEnd(handler: TouchHandler): () => void {
    return this.get().onTouchEnd(handler);
  }
}

export const Input = new InputManager();
