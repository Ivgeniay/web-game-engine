import type { LayoutStorage } from '@/layout/layoutPersistence';
import { EditorFrame } from '@/shell/EditorFrame';

interface AppProps {
  readonly layoutStorage: LayoutStorage;
}

export function App({ layoutStorage }: AppProps) {
  return <EditorFrame layoutStorage={layoutStorage} />;
}
