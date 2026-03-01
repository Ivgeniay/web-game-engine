import { useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggle}
      className="px-4 py-2 rounded bg-accent text-primary hover:bg-accent-hover border border-default transition-colors"
    >
      {isDark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
