import { useState } from "react";
import { useUserStore } from "../../store/user_store";
import { api } from "../../api/api";

interface RegisterFormProps {
  onSwitch: () => void;
}

export function RegisterForm({ onSwitch }: RegisterFormProps) {
  const setUser = useUserStore((state) => state.setUser);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
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
      const registerResponse = await api.post("/auth/register", {
        username,
        password,
        email: email.trim() || undefined,
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        setError(registerData.error ?? "Registration failed");
        return;
      }

      const loginResponse = await api.post("/auth/login", {
        username,
        password,
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        setError(loginData.error ?? "Login after registration failed");
        return;
      }

      setUser(
        {
          id: loginData.id,
          username: loginData.username,
          email: loginData.email ?? null,
        },
        loginData.token,
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
      <div className="flex flex-col gap-1">
        <label className="text-xs text-secondary select-none">
          Email <span className="text-disabled">(optional)</span>
        </label>
        <input
          type="email"
          className="bg-panel border border-default rounded px-2 py-1 text-sm text-primary outline-none focus:border-focus"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="email@example.com"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      {error && <span className="text-xs text-error">{error}</span>}
      <button
        className="bg-accent hover:bg-accent-hover text-primary text-sm rounded py-1 transition-colors select-none disabled:opacity-50"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
      <button
        className="text-xs text-secondary hover:text-primary transition-colors select-none"
        onClick={onSwitch}
      >
        Already have an account? Login
      </button>
    </div>
  );
}
