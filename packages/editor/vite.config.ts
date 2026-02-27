import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@proton/engine": "../engine/src",
      "@proton/shared": "../shared/src",
      "@proton/stdlib": "../stdlib/src",
    },
  },
});
