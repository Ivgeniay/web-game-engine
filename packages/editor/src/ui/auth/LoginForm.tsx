import { useState } from "react";
import { useUserStore } from "../../store/user_store";
import { client } from "../../api/client";

interface LoginFormProps {
  onSwitch: () => void;
}

export function LoginForm({ onSwitch }: LoginFormProps) {
  const setUser = useUserStore((state) => state.setUser);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await client.post("/auth/login", { username, password });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Login failed");
        return;
      }

      setUser(
        { id: data.id, username: data.username, email: data.email ?? null },
        data.token,
      );
    } catch {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-secondary select-none">Username</label>
        <input
          className="bg-panel border border-default rounded px-2 py-1 text-sm text-primary outline-none focus:border-focus"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="username"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-secondary select-none">Password</label>
        <input
          type="password"
          className="bg-panel border border-default rounded px-2 py-1 text-sm text-primary outline-none focus:border-focus"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="password"
        />
      </div>
      {error && <span className="text-xs text-error">{error}</span>}
      <button
        className="bg-accent hover:bg-accent-hover text-primary text-sm rounded py-1 transition-colors select-none disabled:opacity-50"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      <button
        className="text-xs text-secondary hover:text-primary transition-colors select-none"
        onClick={onSwitch}
      >
        No account? Register
      </button>
    </div>
  );
}
