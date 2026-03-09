import { registerFileExplorerMenu } from "./config/register_file_explorer_cmenu";
import { useEditorStore } from "./store/editor_store";
import { BrowserInput, Input } from "@proton/engine";
import { UILibConfiguration } from "@proton/ui";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App";
import "./index.css";

document.addEventListener("contextmenu", (e) => e.preventDefault());
registerFileExplorerMenu();
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
