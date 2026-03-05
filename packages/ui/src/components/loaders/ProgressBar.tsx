interface ProgressBarProps {
  value: number;
  width?: number;
  height?: number;
  className?: string;
}

interface ProgressBarWithLabelProps extends ProgressBarProps {
  label?: string;
  showPercent?: boolean;
  labelClassName?: string;
}

export function ProgressBar({
  value,
  width = 192,
  height = 4,
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={`bg-panel overflow-hidden border border-default ${className}`}
      style={{ width, height, borderRadius: height }}
    >
      <div
        className="h-full bg-accent transition-all duration-200"
        style={{ width: `${clamped}%`, height }}
      />
    </div>
  );
}

export function ProgressBarWithLabel({
  value,
  width = 192,
  height = 4,
  label,
  showPercent = true,
  className = "",
  labelClassName = "",
}: ProgressBarWithLabelProps) {
  const clamped = Math.min(100, Math.max(0, value));

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
      <ProgressBar value={clamped} width={width} height={height} />
      {showPercent && (
        <span className="text-xs text-disabled select-none">{clamped}%</span>
      )}
    </div>
  );
}
