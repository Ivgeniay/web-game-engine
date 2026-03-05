import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import { useProjectStore } from "../../../store/project_store";
import { useUserStore } from "../../../store/user_store";
import type { ProjectMemberView } from "@proton/shared";
import { Debug } from "@proton/engine";

export function CollaborativeSettings() {
  const projectId = useProjectStore((state) => state.activeProject?.id);
  const currentUserId = useUserStore((state) => state.user?.id);

  const [members, setMembers] = useState<ProjectMemberView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;
    loadMembers();
  }, [projectId]);

  const loadMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/projects/${projectId}/members`);
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Failed to load members");
        return;
      }
      setMembers(data);
    } catch {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!search.trim()) return;
    setAddError(null);
    setAdding(true);
    try {
      const response = await api.post("/projects/members/add", {
        projectId,
        usernameOrEmail: search.trim(),
      });
      const data = await response.json();
      if (!response.ok) {
        setAddError(data.error ?? "Failed to add member");
        return;
      }
      setMembers((prev) => [...prev, data]);
      setSearch("");
    } catch {
      setAddError("Could not connect to server");
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (userId: number) => {
    Debug.Verbose(`Delete ${userId} from ${projectId}`);
    Debug.Verbose(`currentUserId: ${currentUserId}`);
    if (userId === currentUserId) {
      Debug.Verbose(`Удаляешь сам себя`);
    }
    return;
    try {
      const response = await api.post("/projects/members/remove", {
        projectId,
        userId,
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error ?? "Failed to remove member");
        return;
      }
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
    } catch {
      setError("Could not connect to server");
    }
  };

  if (!projectId) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-xs text-disabled">No active project</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-primary select-none">
          Collaborative Developing
        </span>
        <span className="text-xs text-secondary select-none">
          Manage who has access to this project.
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-secondary select-none">Add member</span>
        <div className="flex gap-2">
          <input
            className="flex-1 bg-secondary border border-default rounded px-2 py-1 text-xs text-primary outline-none focus:border-focus"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Username or email"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            className="px-3 py-1 text-xs bg-accent hover:bg-accent-hover text-primary rounded transition-colors select-none disabled:opacity-50"
            onClick={handleAdd}
            disabled={adding}
          >
            {adding ? "Adding..." : "Add"}
          </button>
        </div>
        {addError && <span className="text-xs text-error">{addError}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-secondary select-none">Members</span>
        {loading ? (
          <span className="text-xs text-disabled select-none">Loading...</span>
        ) : error ? (
          <span className="text-xs text-error">{error}</span>
        ) : members.length === 0 ? (
          <span className="text-xs text-disabled select-none">
            No members yet
          </span>
        ) : (
          <div className="flex flex-col gap-1">
            {members.map((m) => (
              <div
                key={m.userId}
                className="flex items-center justify-between px-3 py-2 bg-secondary border border-default rounded"
              >
                <span className="text-xs text-primary select-none">
                  {m.username}
                </span>
                <div className="flex gap-1">
                  <button
                    className="px-2 py-0.5 text-xs text-disabled hover:text-primary transition-colors select-none disabled:opacity-30"
                    disabled
                  >
                    Message
                  </button>
                  {m.userId !== currentUserId && (
                    <button
                      className="px-2 py-0.5 text-xs text-error hover:bg-hover rounded transition-colors select-none"
                      onClick={() => handleRemove(m.userId)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
