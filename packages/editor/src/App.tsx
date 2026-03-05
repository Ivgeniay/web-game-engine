import { useProjectStore } from "./store/project_store";
import { useUserStore } from "./store/user_store";
import { AuthPage } from "./ui/auth/AuthPage";
import { UIEditor } from "./ui/main_editor_layouts/UIEditor";
import { ProjectPage } from "./ui/project/ProjectPage";

export default function App() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const activeProject = useProjectStore((state) => state.activeProject);

  if (!isAuthenticated) return <AuthPage />;
  if (!activeProject) return <ProjectPage />;
  return <UIEditor />;
}
