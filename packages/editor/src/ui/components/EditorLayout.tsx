import { type FunctionComponent, type JSX } from "react";
import { DockviewReact } from "dockview";
import type {
  DockviewApi,
  DockviewReadyEvent,
  IDockviewPanelProps,
} from "dockview";
import "dockview/dist/styles/dockview.css";

interface PanelParams {
  component: () => JSX.Element;
}

interface EditorLayoutProps {
  onReady: (api: DockviewApi) => void;
  class_?: string;
}

function PanelContent({ params }: IDockviewPanelProps<PanelParams>) {
  const Component = params.component;
  return <Component />;
}

const components: Record<string, FunctionComponent<IDockviewPanelProps>> = {
  content: PanelContent,
};

export function EditorLayout(prop: EditorLayoutProps) {
  const handleReady = (event: DockviewReadyEvent) => {
    prop.onReady(event.api);
  };

  return (
    <DockviewReact
      className={prop.class_}
      components={components}
      onReady={handleReady}
    />
  );
}
