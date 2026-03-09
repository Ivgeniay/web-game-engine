import {
  FileIcon,
  IconRow,
  IconRowSpace,
  IconTile,
  IconTileSpace,
  type IconSpaceItem,
  type TreeItem,
} from "@proton/ui";

export function InspectorPanel() {
  // return (
  //   <IconRow
  //     icon={FileIcon}
  //     label="Tete"
  //     ext="png"
  //     size={70}
  //     isDragOver={true}
  //     selected={false}
  //     disabled={false}
  //   />
  // );
  // return (
  //   <IconTile
  //     icon={FileIcon}
  //     label="Tete"
  //     ext="png"
  //     size={70}
  //     isDragOver={true}
  //     selected={false}
  //     disabled={false}
  //   />
  // );
  // const items2: TreeItem[] = [
  //   {
  //     id: "1",
  //     label: "Assets",
  //     ext: "directory",
  //     children: [
  //       {
  //         id: "2",
  //         label: "Textures",
  //         ext: "directory",
  //         children: [
  //           { id: "3", label: "albedo.png", ext: "png" },
  //           { id: "4", label: "normal.png", ext: "png" },
  //           { id: "5", label: "roughness.png", ext: "png" },
  //           { id: "6", label: "skybox.hdr", ext: "hdr" },
  //           { id: "7", label: "emissive.png", ext: "png" },
  //         ],
  //       },
  //       {
  //         id: "8",
  //         label: "Scripts",
  //         ext: "directory",
  //         children: [
  //           { id: "9", label: "player.ts", ext: "ts" },
  //           { id: "10", label: "enemy.ts", ext: "ts" },
  //           { id: "11", label: "physics.ts", ext: "ts" },
  //           { id: "12", label: "input.ts", ext: "ts" },
  //           { id: "13", label: "camera.ts", ext: "ts" },
  //         ],
  //       },
  //       {
  //         id: "14",
  //         label: "Models",
  //         ext: "directory",
  //         children: [
  //           { id: "15", label: "player.glb", ext: "glb" },
  //           { id: "16", label: "enemy.glb", ext: "glb" },
  //           { id: "17", label: "tree.gltf", ext: "gltf" },
  //           { id: "18", label: "rock.obj", ext: "obj" },
  //           { id: "19", label: "building.fbx", ext: "fbx" },
  //         ],
  //       },
  //       {
  //         id: "20",
  //         label: "Audio",
  //         ext: "directory",
  //         children: [
  //           { id: "21", label: "soundtrack.mp3", ext: "mp3" },
  //           { id: "22", label: "explosion.wav", ext: "wav" },
  //           { id: "23", label: "footstep.ogg", ext: "ogg" },
  //           { id: "24", label: "ambient.flac", ext: "flac" },
  //         ],
  //       },
  //       {
  //         id: "25",
  //         label: "Materials",
  //         ext: "directory",
  //         children: [
  //           { id: "26", label: "ground.mat", ext: "mat" },
  //           { id: "27", label: "metal.mat", ext: "mat" },
  //           { id: "28", label: "wood.mat", ext: "mat" },
  //         ],
  //       },
  //       {
  //         id: "29",
  //         label: "Scenes",
  //         ext: "directory",
  //         children: [
  //           { id: "30", label: "main.scene", ext: "scene" },
  //           { id: "31", label: "menu.scene", ext: "scene" },
  //           { id: "32", label: "level_01.scene", ext: "scene" },
  //         ],
  //       },
  //       {
  //         id: "33",
  //         label: "Prefabs",
  //         ext: "directory",
  //         children: [
  //           { id: "34", label: "player.prefab", ext: "prefab" },
  //           { id: "35", label: "enemy.prefab", ext: "prefab" },
  //           { id: "36", label: "projectile.prefab", ext: "prefab" },
  //         ],
  //       },
  //     ],
  //   },
  // ];
  // return (
  //   <IconRowSpace
  //     items={items2}
  //     icon={FileIcon}
  //     size={28}
  //     isDragOver="Assets"
  //     selected={["34", "35", "31", "33"]}
  //   />
  // );
  // const items: IconSpaceItem[] = [
  //   { label: "Textures", ext: "directory", id: "1" },
  //   { label: "Scripts", ext: "directory", id: "2" },
  //   { label: "player.ts", ext: "ts", id: "3" },
  //   { label: "enemy.ts", ext: "ts", id: "4" },
  //   { label: "physics.ts", ext: "ts", id: "5" },
  //   { label: "albedo.png", ext: "png", id: "6" },
  //   { label: "Assets", ext: "directory", id: "7" },
  //   {
  //     label:
  //       "very_long_very_long_very_long_very_long_very_long_very_long_filename_that_wont_fit",
  //     ext: "",
  //     id: "8",
  //   },
  //   { label: "normal.png", ext: "png", id: "9" },
  //   { label: "skybox.hdr", ext: "hdr", id: "10" },
  //   { label: "explosion.wav", ext: "wav", id: "11" },
  //   { label: "soundtrack.mp3", ext: "mp3", id: "12" },
  //   { label: "player.glb", ext: "glb", id: "13" },
  //   { label: "environment.gltf", ext: "gltf", id: "14" },
  //   { label: "main.scene", ext: "scene", id: "15" },
  //   { label: "player.prefab", ext: "prefab", id: "16" },
  //   {
  //     label:
  //       "very_long_very_long_very_long_very_long_very_long_very_long_filename_that_wont_fit.mat",
  //     ext: "mat",
  //     id: "17",
  //   },
  // ];
  // return (
  //   <IconTileSpace
  //     items={items}
  //     icon={FileIcon}
  //     size={180}
  //     gap={10}
  //     isDragOver={true}
  //     selected={["4", "1", "2", "17", "18"]}
  //   />
  // );
  return (
    <div className="w-full h-full bg-panel text-primary flex items-center justify-center">
      Inspector panel content
    </div>
  );
}
