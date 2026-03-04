import { DebugLevel } from "@proton/engine";
import { useDebugStore, ALL_LEVELS_MASK } from "../../../store/debug_store";

const LEVELS: DebugLevel[] = [
  DebugLevel.Verbose,
  DebugLevel.Debug,
  DebugLevel.Info,
  DebugLevel.Warning,
  DebugLevel.Error,
  DebugLevel.Fatal,
];

const levelLabels: Record<DebugLevel, string> = {
  [DebugLevel.Verbose]: "Verbose",
  [DebugLevel.Debug]: "Debug",
  [DebugLevel.Info]: "Info",
  [DebugLevel.Warning]: "Warning",
  [DebugLevel.Error]: "Error",
  [DebugLevel.Fatal]: "Fatal",
};

interface ConsoleToolbarProps {
  autoScroll: boolean;
  onAutoScrollChange: (value: boolean) => void;
}

export function ConsoleToolbar({
  autoScroll,
  onAutoScrollChange,
}: ConsoleToolbarProps) {
  const filterMask = useDebugStore((state) => state.filterMask);
  const setFilterMask = useDebugStore((state) => state.setFilterMask);
  const clearMessages = useDebugStore((state) => state.clearMessages);

  const isLevelActive = (level: DebugLevel): boolean => {
    return (filterMask & (1 << level)) !== 0;
  };

  const handleClick = (level: DebugLevel, e: React.MouseEvent) => {
    if (e.shiftKey) {
      let mask = 0;
      for (const l of LEVELS) {
        if (l >= level) {
          mask |= 1 << l;
        }
      }
      setFilterMask(mask);
      return;
    }

    const bit = 1 << level;
    setFilterMask(filterMask ^ bit);
  };

  const allActive = filterMask === ALL_LEVELS_MASK;

  const handleToggleAll = () => {
    setFilterMask(allActive ? 0 : ALL_LEVELS_MASK);
  };

  return (
    <div className="flex items-center gap-2 px-2 h-7 bg-secondary border-b border-default shrink-0">
      <button
        className="text-xs text-secondary hover:text-primary transition-colors select-none"
        onClick={handleToggleAll}
      >
        {allActive ? "None" : "All"}
      </button>

      <div className="w-px h-4 border-default shrink-0" />

      {LEVELS.map((level) => (
        <button
          key={level}
          className={`text-xs px-1.5 py-0.5 rounded transition-colors select-none ${
            isLevelActive(level)
              ? "bg-hover text-primary"
              : "text-disabled hover:text-secondary"
          }`}
          onClick={(e) => handleClick(level, e)}
        >
          {levelLabels[level]}
        </button>
      ))}

      <div className="flex-1" />

      <button
        className="text-xs text-secondary hover:text-primary transition-colors select-none"
        onClick={clearMessages}
      >
        Clear
      </button>

      <div className="w-px h-4 border-default shrink-0" />

      <label className="flex items-center gap-1 cursor-pointer select-none">
        <input
          type="checkbox"
          className="w-3 h-3 accent-accent"
          checked={autoScroll}
          onChange={(e) => onAutoScrollChange(e.target.checked)}
        />
        <span className="text-xs text-secondary">Auto-scroll</span>
      </label>
    </div>
  );
}
