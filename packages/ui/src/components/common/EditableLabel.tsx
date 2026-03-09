import { useEffect, useRef, useState } from "react";

interface EditableLabelProps {
  value: string;
  editing?: boolean;
  multiline?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onConfirm?: (value: string) => void;
  onCancel?: () => void;
}

export function EditableLabel({
  value,
  editing = false,
  multiline = false,
  className = "",
  style,
  onConfirm,
  onCancel,
}: EditableLabelProps): React.ReactElement {
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      onConfirm?.(draft.trim() || value);
    } else if (e.key === "Escape") {
      setDraft(value);
      onCancel?.();
    }
  };

  const handleBlur = () => {
    onConfirm?.(draft.trim() || value);
  };

  const baseStyle: React.CSSProperties = {
    fontSize: "inherit",
    lineHeight: "inherit",
    fontFamily: "inherit",
    ...style,
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className={`bg-panel border border-focus rounded outline-none text-primary w-full ${className}`}
        style={{
          ...baseStyle,
          padding: "0 2px",
          minWidth: 0,
        }}
        spellCheck={false}
      />
    );
  }

  if (multiline) {
    return (
      <span
        className={className}
        style={{
          ...baseStyle,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          width: "100%",
          wordBreak: "break-word",
        }}
      >
        {value}
      </span>
    );
  }

  return (
    <span className={`truncate ${className}`} style={baseStyle}>
      {value}
    </span>
  );
}
