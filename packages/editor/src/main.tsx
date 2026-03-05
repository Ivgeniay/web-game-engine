import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = document.getElementById("root")!;
{
  /* <StrictMode>
  </StrictMode>, */
}
createRoot(root).render(<App />);
