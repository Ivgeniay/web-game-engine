interface ProgressBarProps {
  value: number;
  label?: string;
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-primary gap-3">
      {label && (
        <span className="text-xs text-secondary select-none">{label}</span>
      )}
      <div className="w-48 h-1 bg-panel rounded-full overflow-hidden border border-default">
        <div
          className="h-full bg-accent rounded-full transition-all duration-200"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="text-xs text-disabled select-none">{clamped}%</span>
    </div>
  );
}
