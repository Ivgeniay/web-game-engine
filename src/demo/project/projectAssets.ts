import { frameworkIcons } from '@/icons/frameworkIcons';
import type { TreeModel } from '@/ui/treeView/treeModel';

const PATH_SEPARATOR = '/';

export const PROJECT_ROOT_ID = 'Assets';

const FOLDERS: Readonly<Record<string, readonly string[]>> = {
  Assets: ['Materials', 'Models', 'Prefabs', 'Scenes', 'Scripts', 'Textures'],
  'Assets/Materials': ['Ground.mat', 'Rock.mat', 'Player.mat'],
  'Assets/Models': ['Characters', 'Props'],
  'Assets/Models/Characters': ['Player.fbx', 'Goblin.fbx'],
  'Assets/Models/Props': ['Rock.fbx', 'Lamp.fbx', 'Crate.fbx'],
  'Assets/Prefabs': ['Player.prefab', 'Lamp.prefab'],
  'Assets/Scenes': ['Main.scene', 'Menu.scene'],
  'Assets/Scripts': ['Gameplay', 'UI'],
  'Assets/Scripts/Gameplay': ['PlayerController.ts', 'Health.ts', 'Spawner.ts'],
  'Assets/Scripts/UI': ['MainMenu.ts', 'HealthBar.ts'],
  'Assets/Textures': ['Ground.png', 'Rock.png', 'Sky.png'],
};

function childPath(parent: string, name: string): string {
  return `${parent}${PATH_SEPARATOR}${name}`;
}

function nameOf(path: string): string {
  return path.slice(path.lastIndexOf(PATH_SEPARATOR) + 1);
}

function isFolder(path: string): boolean {
  return path in FOLDERS;
}

export const PROJECT_TREE: TreeModel = {
  rootIds: [PROJECT_ROOT_ID],
  getChildren: (path) => (FOLDERS[path] ?? []).map((name) => childPath(path, name)),
  hasChildren: isFolder,
  getLabel: nameOf,
  getIcon: (path, expanded) => {
    if (!isFolder(path)) {
      return frameworkIcons.file;
    }

    return expanded ? frameworkIcons['folder-open'] : frameworkIcons.folder;
  },
};
