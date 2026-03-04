import { useState } from "react";

interface JsonValueProps {
  value: unknown;
  depth: number;
}

function JsonValue({ value, depth }: JsonValueProps) {
  const [isOpen, setIsOpen] = useState(false);
  const indent = " ".repeat(depth * 2);
  const indentClose = " ".repeat((depth - 1) * 2);

  if (value === null) {
    return <span className="text-disabled">null</span>;
  }

  if (typeof value === "boolean") {
    return <span className="text-accent">{String(value)}</span>;
  }

  if (typeof value === "number") {
    return <span className="text-warning">{value}</span>;
  }

  if (typeof value === "string") {
    return <span>"{value}"</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-primary">{"[]"}</span>;
    }

    if (!isOpen) {
      return (
        <>
          <span
            className="text-primary cursor-pointer hover:bg-hover rounded px-0.5"
            onClick={() => setIsOpen(true)}
          >
            {"["}
          </span>
          <span
            className="text-disabled cursor-pointer hover:bg-hover rounded px-0.5"
            onClick={() => setIsOpen(true)}
          >
            ...{value.length}
          </span>
          <span className="text-primary">{"]"}</span>
        </>
      );
    }

    return (
      <>
        <span
          className="text-primary cursor-pointer hover:bg-hover rounded px-0.5"
          onClick={() => setIsOpen(false)}
        >
          {"["}
        </span>
        {value.map((item, i) => (
          <span key={i}>
            {"\n" + indent}
            <JsonValue value={item} depth={depth + 1} />
            {i < value.length - 1 && (
              <span className="text-primary">{","}</span>
            )}
          </span>
        ))}
        {"\n" + indentClose}
        <span className="text-primary">{"]"}</span>
      </>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);

    if (entries.length === 0) {
      return <span className="text-primary">{"{}"}</span>;
    }

    if (!isOpen) {
      return (
        <>
          <span
            className="text-primary cursor-pointer hover:bg-hover rounded px-0.5"
            onClick={() => setIsOpen(true)}
          >
            {"{"}
          </span>
          <span
            className="text-disabled cursor-pointer hover:bg-hover rounded px-0.5"
            onClick={() => setIsOpen(true)}
          >
            ...{entries.length}
          </span>
          <span className="text-primary">{"}"}</span>
        </>
      );
    }

    return (
      <>
        <span
          className="text-primary cursor-pointer hover:bg-hover rounded px-0.5"
          onClick={() => setIsOpen(false)}
        >
          {"{"}
        </span>
        {entries.map(([key, val], i) => (
          <span key={key}>
            {"\n" + indent}
            <span className="text-accent">"{key}"</span>
            <span className="text-primary">{": "}</span>
            <JsonValue value={val} depth={depth + 1} />
            {i < entries.length - 1 && (
              <span className="text-primary">{","}</span>
            )}
          </span>
        ))}
        {"\n" + indentClose}
        <span className="text-primary">{"}"}</span>
      </>
    );
  }

  return <span className="text-primary">{String(value)}</span>;
}

interface RenderJsonProps {
  text: string;
}

export function RenderJson({ text }: RenderJsonProps) {
  try {
    const parsed: unknown = JSON.parse(text);
    return <JsonValue value={parsed} depth={1} />;
  } catch {
    return <span className="text-error">[Invalid JSON] {text}</span>;
  }
}
