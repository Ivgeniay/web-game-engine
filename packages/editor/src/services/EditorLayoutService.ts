import { Debug } from "@proton/engine";
import type { DockviewApi, SerializedDockview } from "dockview";
import type { JSX } from "react";

interface PanelParams {
  component: () => JSX.Element;
  [key: string]: unknown;
}

interface OpenPanelOptions {
  id: string;
  title: string;
  component: () => JSX.Element;
  params?: Record<string, unknown>;
  position?: {
    referencePanel: string;
    direction?: "left" | "right" | "above" | "below" | "within";
  };
  initialWidth?: number;
  initialHeight?: number;
  floating?: boolean;
}

class EditorLayoutServiceClass {
  private api: DockviewApi | null = null;
  private components: Map<string, () => JSX.Element> = new Map();

  connect(api: DockviewApi): void {
    this.api = api;
  }

  disconnect(): void {
    this.api = null;
  }

  registerComponent(id: string, component: () => JSX.Element): void {
    this.components.set(id, component);
  }

  openPanel(options: OpenPanelOptions): void {
    if (!this.api) return;

    const existing = this.api.getPanel(options.id);
    if (existing) {
      existing.focus();
      return;
    }

    const params: PanelParams = {
      component: options.component,
      ...options.params,
    };

    if (options.floating) {
      this.api.addPanel({
        id: options.id,
        component: "content",
        title: options.title,
        params,
        floating: {
          width: options.initialWidth ?? 600,
          height: options.initialHeight ?? 400,
        },
      });
      return;
    }

    this.api.addPanel({
      id: options.id,
      component: "content",
      title: options.title,
      params,
      position: options.position,
      initialWidth: options.initialWidth,
      initialHeight: options.initialHeight,
    });
  }

  closePanel(id: string): void {
    if (!this.api) return;
    const panel = this.api.getPanel(id);
    if (panel) panel.api.close();
  }

  focusPanel(id: string): void {
    if (!this.api) return;
    const panel = this.api.getPanel(id);
    if (panel) panel.focus();
  }

  serialize(): SerializedDockview | null {
    if (!this.api) return null;
    return this.api.toJSON();
  }

  restore(layout: SerializedDockview): void {
    if (!this.api) return;
    for (const [id, panel] of Object.entries(layout.panels)) {
      const component = this.components.get(id);
      if (component) {
        panel.params = { ...panel.params, component };
      }
    }

    this.api.fromJSON(layout);
  }

  isConnected(): boolean {
    return this.api !== null;
  }
}

export const EditorLayoutService = new EditorLayoutServiceClass();
