interface IndeterminateBarProps {
  width?: number;
  height?: number;
  runnerWidth?: number;
  className?: string;
}

interface IndeterminateBarWithLabelProps extends IndeterminateBarProps {
  label?: string;
  labelClassName?: string;
}

export function IndeterminateBar({
  width = 192,
  height = 6,
  runnerWidth = 64,
  className = "",
}: IndeterminateBarProps) {
  return (
    <div
      className={`bg-panel overflow-hidden border border-default ${className}`}
      style={{ width, height, borderRadius: height }}
    >
      <div
        className="bg-accent animate-indeterminate"
        style={{ width: runnerWidth, height }}
      />
    </div>
  );
}

export function IndeterminateBarWithLabel({
  width = 192,
  height = 6,
  runnerWidth = 64,
  label,
  className = "",
  labelClassName = "",
}: IndeterminateBarWithLabelProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-full bg-primary gap-3 ${className}`}
    >
      {label && (
        <span
          className={`text-xs text-secondary select-none ${labelClassName}`}
        >
          {label}
        </span>
      )}
      <IndeterminateBar
        width={width}
        height={height}
        runnerWidth={runnerWidth}
      />
    </div>
  );
}
