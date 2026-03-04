import type { World } from "../../core/ecs/World";

export abstract class RenderSystem {
  protected readonly world: World;

  constructor(world: World) {
    this.world = world;
  }

  onInit(): void {}
  onEnable(): void {}
  onDisable(): void {}
  onDestroy(): void {}

  abstract onRender(ctx: GPUCommandEncoder): void;
}
