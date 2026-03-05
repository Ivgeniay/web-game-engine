import { useState, type JSX } from "react";
import { CollaborativeSettings } from "./CollaborativeSettings";

interface SettingsCategory {
  id: string;
  label: string;
  component: () => JSX.Element;
}

const categories: SettingsCategory[] = [
  {
    id: "collaborative",
    label: "Collaborative Developing",
    component: CollaborativeSettings,
  },
];

export function SettingsPanel() {
  const [activeCategory, setActiveCategory] = useState(categories[0]!.id);

  const active = categories.find((c) => c.id === activeCategory)!;
  const Component = active.component;

  return (
    <div className="flex w-full h-full">
      <div className="w-48 shrink-0 bg-secondary border-r border-default flex flex-col">
        {categories.map((c) => (
          <button
            key={c.id}
            className={`text-left px-3 py-2 text-xs transition-colors select-none ${
              activeCategory === c.id
                ? "bg-hover text-primary"
                : "text-secondary hover:text-primary hover:bg-hover"
            }`}
            onClick={() => setActiveCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto bg-panel">
        <Component />
      </div>
    </div>
  );
}
