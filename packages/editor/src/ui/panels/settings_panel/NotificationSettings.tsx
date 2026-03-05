import { useState } from "react";
import type {
  NotificationSettings,
  NotificationPosition,
} from "@proton/shared";
import { NotificationService } from "../../../services/NotificationService";
import { useProjectStore } from "../../../store/project_store";
import { api } from "../../../api/api";
import { PersonalSettingsKeys } from "@proton/shared";

const positions: { value: NotificationPosition; label: string }[] = [
  { value: "top-left", label: "Top Left" },
  { value: "top-right", label: "Top Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-right", label: "Bottom Right" },
];

const testTypes = ["info", "success", "warning", "error"] as const;

export function NotificationSettings() {
  const projectId = useProjectStore((state) => state.activeProject?.id);
  const [settings, setSettings] = useState<NotificationSettings>(
    NotificationService.getSettings(),
  );
  const [saving, setSaving] = useState(false);

  const handleChange = (patch: Partial<NotificationSettings>) => {
    const updated = { ...settings, ...patch };
    setSettings(updated);
    NotificationService.applySettings(updated);
  };

  const handleSave = async () => {
    if (!projectId) return;
    setSaving(true);
    try {
      await api.put(`/projects/${projectId}/user-settings`, {
        key: PersonalSettingsKeys.editorNotifications,
        value: JSON.stringify(settings),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-primary select-none">
          Notifications
        </span>
        <span className="text-xs text-secondary select-none">
          Configure how notifications appear in the editor.
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-secondary select-none">Position</span>
        <div className="grid grid-cols-2 gap-1">
          {positions.map((p) => (
            <button
              key={p.value}
              className={`text-xs px-2 py-1.5 rounded border transition-colors select-none text-left ${
                settings.position === p.value
                  ? "border-focus bg-hover text-primary"
                  : "border-default text-secondary hover:text-primary hover:bg-hover"
              }`}
              onClick={() => handleChange({ position: p.value })}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-secondary select-none">
          Duration: {settings.duration}ms
        </span>
        <input
          type="range"
          min={1000}
          max={10000}
          step={500}
          value={settings.duration}
          onChange={(e) => handleChange({ duration: Number(e.target.value) })}
          className="w-full accent-accent"
        />
        <div className="flex justify-between">
          <span className="text-xs text-disabled select-none">1s</span>
          <span className="text-xs text-disabled select-none">10s</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-secondary select-none">
          Max visible: {settings.maxCount}
        </span>
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={settings.maxCount}
          onChange={(e) => handleChange({ maxCount: Number(e.target.value) })}
          className="w-full accent-accent"
        />
        <div className="flex justify-between">
          <span className="text-xs text-disabled select-none">1</span>
          <span className="text-xs text-disabled select-none">10</span>
        </div>
      </div>

      <button
        className="text-xs px-3 py-1 bg-accent hover:bg-accent-hover text-primary rounded transition-colors select-none disabled:opacity-50 self-start"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save"}
      </button>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-secondary select-none">
          Test notifications
        </span>
        <div className="flex gap-2">
          {testTypes.map((type) => (
            <button
              key={type}
              className="text-xs px-2 py-1 rounded border border-default hover:bg-hover text-secondary hover:text-primary transition-colors select-none capitalize"
              onClick={() =>
                NotificationService[type](
                  "Test notification",
                  `This is a ${type} message`,
                )
              }
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
