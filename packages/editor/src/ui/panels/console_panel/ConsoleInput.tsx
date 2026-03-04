import { useState, useRef, useCallback } from "react";
import { Debug } from "@proton/engine";
import { MessageStyle } from "@proton/engine";

interface Command {
  name: string;
  handler: (args: string[]) => string;
}

const commands: Command[] = [
  {
    name: "hello",
    handler: () => "world",
  },
];

function executeCommand(input: string): string | null {
  const parts = input.trim().split(/\s+/);
  const name = parts[0]?.toLowerCase();
  const args = parts.slice(1);

  if (!name) return null;

  const command = commands.find((c) => c.name === name);
  if (!command) return `Unknown command: "${name}"`;

  return command.handler(args);
}

export function ConsoleInput() {
  const [value, setValue] = useState("");
  const history = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1);

  const submit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;

    history.current.unshift(trimmed);
    historyIndex.current = -1;

    Debug.Info(`> ${trimmed}`, MessageStyle.Bold | MessageStyle.NotSelectable);

    const result = executeCommand(trimmed);
    if (result !== null) {
      Debug.Info(result, MessageStyle.NotSelectable);
    }

    setValue("");
  }, [value]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submit();
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = historyIndex.current + 1;
      if (next < history.current.length) {
        historyIndex.current = next;
        setValue(history.current[next] ?? "");
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = historyIndex.current - 1;
      if (next < 0) {
        historyIndex.current = -1;
        setValue("");
      } else {
        historyIndex.current = next;
        setValue(history.current[next] ?? "");
      }
    }
  };

  return (
    <div className="flex items-center h-7 bg-secondary border-t border-default shrink-0 px-2 gap-1">
      <span className="text-xs text-disabled select-none">{">"}</span>
      <input
        className="flex-1 bg-transparent text-xs text-primary outline-none placeholder:text-disabled"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Enter command..."
        spellCheck={false}
        autoComplete="off"
      />
    </div>
  );
}
