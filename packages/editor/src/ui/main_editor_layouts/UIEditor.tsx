import { Header } from "./Header";
import { Workspace } from "./Workspace";
import { Footer } from "./Footer";

export function UIEditor() {
  return (
    <div className="flex flex-col w-screen h-screen bg-primary overflow-hidden">
      <Header />
      <Workspace />
      <Footer />
    </div>
  );
}
