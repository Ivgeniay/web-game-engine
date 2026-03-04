import { DebugLevel, MessageStyle } from "./DebugLevel";
import type { DebugMessage } from "./DebugMessage";

type AddMessageFn = (message: DebugMessage) => void;

let _addMessage: AddMessageFn | null = null;
let _nextId = 0;

export class Debug {
  static connect(fn: AddMessageFn): void {
    _addMessage = fn;
  }

  static disconnect(): void {
    _addMessage = null;
  }

  private static push(
    level: DebugLevel,
    text: string,
    style: MessageStyle,
  ): void {
    if (!_addMessage) return;
    _addMessage({
      id: _nextId++,
      level,
      text,
      style,
      timestamp: Date.now(),
    });
  }

  static Verbose(text: string, style: MessageStyle = MessageStyle.None): void {
    Debug.push(DebugLevel.Verbose, text, style);
  }

  static Debug(text: string, style: MessageStyle = MessageStyle.None): void {
    Debug.push(DebugLevel.Debug, text, style);
  }

  static Info(text: string, style: MessageStyle = MessageStyle.None): void {
    Debug.push(DebugLevel.Info, text, style);
  }

  static Warning(text: string, style: MessageStyle = MessageStyle.None): void {
    Debug.push(DebugLevel.Warning, text, style);
  }

  static Error(text: string, style: MessageStyle = MessageStyle.None): void {
    Debug.push(DebugLevel.Error, text, style);
  }

  static Fatal(text: string, style: MessageStyle = MessageStyle.None): void {
    Debug.push(DebugLevel.Fatal, text, style);
  }
}
