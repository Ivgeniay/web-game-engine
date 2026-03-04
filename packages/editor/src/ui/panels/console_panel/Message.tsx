import type { ReactNode } from "react";
import type { DebugMessage } from "@proton/engine";
import { DebugLevel, MessageStyle } from "@proton/engine";
import { RenderJson } from "./RenderJson";

interface MessageProps {
  message: DebugMessage;
}

const levelLabels: Record<DebugLevel, string> = {
  [DebugLevel.Verbose]: "VERBOSE",
  [DebugLevel.Debug]: "DEBUG",
  [DebugLevel.Info]: "INFO",
  [DebugLevel.Warning]: "WARNING",
  [DebugLevel.Error]: "ERROR",
  [DebugLevel.Fatal]: "FATAL",
};

const levelColors: Record<DebugLevel, string> = {
  [DebugLevel.Verbose]: "text-secondary",
  [DebugLevel.Debug]: "text-secondary",
  [DebugLevel.Info]: "text-primary",
  [DebugLevel.Warning]: "text-warning",
  [DebugLevel.Error]: "text-error",
  [DebugLevel.Fatal]: "text-error",
};

function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export function Message({ message }: MessageProps) {
  const isBold = (message.style & MessageStyle.Bold) !== 0;
  const isItalic = (message.style & MessageStyle.Italic) !== 0;
  const isNotSelectable = (message.style & MessageStyle.NotSelectable) !== 0;
  const isJsonHighlight = (message.style & MessageStyle.JsonHighlight) !== 0;

  const textClass = [
    "text-xs break-words whitespace-pre-wrap flex-1",
    isBold ? "font-bold" : "",
    isItalic ? "italic" : "",
    isNotSelectable ? "select-none" : "",
    levelColors[message.level],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex items-start gap-2 px-2 py-0.5 hover:bg-hover">
      <span className="text-xs text-disabled shrink-0 mt-px">
        {formatTimestamp(message.timestamp)}
      </span>
      <span
        className={`text-xs shrink-0 mt-px font-mono ${levelColors[message.level]}`}
      >
        {levelLabels[message.level]}
      </span>
      {isJsonHighlight ? (
        // <span className={textClass}>{RenderJson(message.text)}</span>
        <span className={textClass}>
          <RenderJson text={message.text} />
        </span>
      ) : (
        <span className={textClass}>{message.text}</span>
      )}
    </div>
  );
}
