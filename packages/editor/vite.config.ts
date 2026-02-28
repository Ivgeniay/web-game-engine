import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@proton/engine": resolve(__dirname, "../engine/src/index.ts"),
      "@proton/shared": resolve(__dirname, "../shared/src/index.ts"),
      "@proton/stdlib": resolve(__dirname, "../stdlib/src/index.ts"),
      "@proton/ui": resolve(__dirname, "../ui/src"),
    },
  },
});
