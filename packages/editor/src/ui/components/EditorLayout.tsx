import { DockviewReact } from "dockview";
import type {
  AddPanelPositionOptions,
  DockviewPanelRenderer,
  DockviewReadyEvent,
  FloatingGroupOptions,
  IDockviewPanelProps,
} from "dockview";
import "dockview/dist/styles/dockview.css";
import type { FunctionComponent, JSX } from "react";

// const components: Record<string, FunctionComponent<IDockviewPanelProps>> = {
//   content: ({ params }: { params: { component: () => JSX.Element } }) => {
//     const Component = params.component;
//     return <Component />;
//   },
// };

interface PanelParams {
  component: () => JSX.Element;
}

interface PanelConfig {
  id: string;
  component: () => JSX.Element;
  title?: string;
  tabComponent?: string;
  renderer?: DockviewPanelRenderer;
  inactive?: boolean;
  initialWidth?: number;
  initialHeight?: number;
  position?: AddPanelPositionOptions;
  floating?: Partial<FloatingGroupOptions> | boolean | undefined;
}

interface EditorLayoutProps {
  panels: PanelConfig[];
}

function PanelContent({ params }: IDockviewPanelProps<PanelParams>) {
  const Component = params.component;
  return <Component />;
}

const components: Record<string, FunctionComponent<IDockviewPanelProps>> = {
  content: PanelContent,
};

export function EditorLayout({ panels }: EditorLayoutProps) {
  const onReady = (event: DockviewReadyEvent) => {
    panels.forEach((panel) => {
      const base = {
        id: panel.id,
        component: "content",
        title: panel.title,
        tabComponent: panel.tabComponent,
        renderer: panel.renderer,
        inactive: panel.inactive,
        initialWidth: panel.initialWidth,
        initialHeight: panel.initialHeight,
        params: { component: panel.component },
      };

      if (panel.floating) {
        event.api.addPanel({ ...base, floating: panel.floating });
      } else if (panel.position) {
        event.api.addPanel({ ...base, position: panel.position });
      } else {
        event.api.addPanel(base);
      }
    });
  };

  return (
    <DockviewReact
      className="w-full h-full"
      components={components}
      onReady={onReady}
    />
  );
}
