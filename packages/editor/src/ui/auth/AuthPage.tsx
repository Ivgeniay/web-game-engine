import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

type AuthView = "login" | "register";

export function AuthPage() {
  const [view, setView] = useState<AuthView>("login");

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-primary">
      <div className="w-80 bg-secondary border border-default rounded p-6 flex flex-col gap-4">
        <div className="flex border-b border-default">
          <button
            className={`flex-1 pb-2 text-sm transition-colors select-none ${
              view === "login"
                ? "text-primary border-b-2 border-focus"
                : "text-secondary hover:text-primary"
            }`}
            onClick={() => setView("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 pb-2 text-sm transition-colors select-none ${
              view === "register"
                ? "text-primary border-b-2 border-focus"
                : "text-secondary hover:text-primary"
            }`}
            onClick={() => setView("register")}
          >
            Register
          </button>
        </div>
        {view === "login" ? (
          <LoginForm onSwitch={() => setView("register")} />
        ) : (
          <RegisterForm onSwitch={() => setView("login")} />
        )}
      </div>
    </div>
  );
}
