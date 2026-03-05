import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { useProjectStore } from "../../store/project_store";
import type { EngineTemplate, Project } from "@proton/shared";

export function ProjectPage() {
  const setProject = useProjectStore((state) => state.setProject);

  const [projects, setProjects] = useState<Project[]>([]);
  const [templates, setTemplates] = useState<EngineTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [projectsRes, templatesRes] = await Promise.all([
          api.get("/projects"),
          api.get("/engine-templates"),
        ]);

        if (!projectsRes.ok || !templatesRes.ok) {
          setError("Failed to load data");
          return;
        }

        const projectsData = await projectsRes.json();
        const templatesData = await templatesRes.json();

        setProjects(projectsData);
        setTemplates(templatesData);
      } catch {
        setError("Could not connect to server");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleCreate = async () => {
    if (!projectName.trim()) {
      setCreateError("Project name is required");
      return;
    }
    if (selectedTemplate === null) {
      setCreateError("Please select a template");
      return;
    }

    setCreateError(null);
    setCreating(true);

    try {
      const response = await api.post("/projects", {
        name: projectName.trim(),
        engineTemplateId: selectedTemplate,
      });

      const data = await response.json();

      if (!response.ok) {
        setCreateError(data.error ?? "Failed to create project");
        return;
      }

      setProject({ id: data.id, name: data.name });
    } catch {
      setCreateError("Could not connect to server");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-primary">
        <span className="text-sm text-secondary">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-primary">
        <span className="text-sm text-error">{error}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-primary">
      <div className="w-[560px] bg-secondary border border-default rounded p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-bold text-primary select-none">
            Projects
          </h1>
          <button
            className="text-xs px-3 py-1 bg-accent hover:bg-accent-hover text-primary rounded transition-colors select-none"
            onClick={() => setShowCreate((v) => !v)}
          >
            {showCreate ? "Cancel" : "New Project"}
          </button>
        </div>

        {showCreate && (
          <div className="flex flex-col gap-3 border border-default rounded p-4 bg-panel">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-secondary select-none">
                Project Name
              </label>
              <input
                className="bg-secondary border border-default rounded px-2 py-1 text-sm text-primary outline-none focus:border-focus"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="My Game"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-secondary select-none">
                Engine Template
              </label>
              <div className="grid grid-cols-2 gap-2">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    className={`text-left p-3 rounded border transition-colors select-none ${
                      selectedTemplate === t.id
                        ? "border-focus bg-hover text-primary"
                        : "border-default bg-secondary text-secondary hover:text-primary hover:bg-hover"
                    }`}
                    onClick={() => setSelectedTemplate(t.id)}
                  >
                    <div className="text-sm font-bold">{t.name}</div>
                    <div className="text-xs mt-0.5 text-disabled">
                      {t.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            {createError && (
              <span className="text-xs text-error">{createError}</span>
            )}
            <button
              className="bg-accent hover:bg-accent-hover text-primary text-sm rounded py-1 transition-colors select-none disabled:opacity-50"
              onClick={handleCreate}
              disabled={creating}
            >
              {creating ? "Creating..." : "Create Project"}
            </button>
          </div>
        )}

        {projects.length === 0 && !showCreate ? (
          <div className="flex items-center justify-center py-8">
            <span className="text-sm text-disabled select-none">
              No projects yet
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {projects.map((p) => (
              <button
                key={p.id}
                className="flex items-center justify-between px-3 py-2 rounded border border-default hover:bg-hover transition-colors text-left select-none"
                onClick={() => setProject({ id: p.id, name: p.name })}
              >
                <span className="text-sm text-primary">{p.name}</span>
                <span className="text-xs text-disabled">
                  {new Date(p.createdAt).toLocaleDateString()}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
