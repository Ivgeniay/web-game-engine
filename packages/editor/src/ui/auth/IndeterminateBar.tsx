interface IndeterminateBarProps {
  label?: string;
}

export function IndeterminateBar({ label }: IndeterminateBarProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-primary gap-3">
      {label && (
        <span className="text-xs text-secondary select-none">{label}</span>
      )}
      <div className="w-48 h-1.5 bg-panel overflow-hidden border border-default">
        <div className="w-16 h-1.5 bg-accent animate-indeterminate" />
      </div>
    </div>
  );
}
