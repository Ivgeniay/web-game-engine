import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserInput, Input } from "@proton/engine";
import { UILibConfiguration } from "@proton/ui";
import { useEditorStore } from "./store/editor_store";

Input.setProvider(new BrowserInput());
UILibConfiguration.configureDragging({
  startDrag: useEditorStore.getState().startDrag,
  endDrag: useEditorStore.getState().endDrag,
});
UILibConfiguration.configureDropping({
  getDragMeta: () => useEditorStore.getState().dragMeta,
});

const root = document.getElementById("root")!;
createRoot(root).render(<App />);
