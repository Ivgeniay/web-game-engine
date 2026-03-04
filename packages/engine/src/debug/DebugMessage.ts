import type { DebugLevel, MessageStyle } from "./DebugLevel";

export interface DebugMessage {
  id: number;
  level: DebugLevel;
  text: string;
  style: MessageStyle;
  timestamp: number;
}
