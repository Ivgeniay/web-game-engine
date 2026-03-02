import { Header } from "./Header";
import { Workspace } from "./Workspace";
import { Footer } from "./Footer";
import { useMenuStore } from "../../store/menu_store";
import { defaultEditorMenu } from "../../config/default_menu";
import { useEffect } from "react";

export function UIEditor() {
  const registerBar = useMenuStore((state) => state.registerBar);
  const unregisterBar = useMenuStore((state) => state.unregisterBar);

  useEffect(() => {
    registerBar(defaultEditorMenu);
    return () => unregisterBar(defaultEditorMenu.id);
  }, []);

  return (
    <div className="flex flex-col w-screen h-screen bg-primary overflow-hidden">
      <Header />
      <Workspace />
      <Footer />
    </div>
  );
}
