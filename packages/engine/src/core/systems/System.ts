import type { World } from "../ecs/World";

export abstract class System {
  protected readonly world: World;

  constructor(world: World) {
    this.world = world;
  }

  onInit(): void {}
  onEnable(): void {}
  onDisable(): void {}
  onDestroy(): void {}

  abstract onUpdate(delta: number): void;
}
