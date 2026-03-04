import type { World } from "../ecs/World";
import type { SystemScheduler } from "../systems/SystemScheduler";

interface WorldEntry {
  world: World;
  scheduler: SystemScheduler;
}

export class MainLoop {
  private worlds: WorldEntry[] = [];
  private lastTimestamp: number = -1;
  private fixedDelta: number;
  private accumulator: number = 0;

  constructor(fixedDelta: number = 0.02) {
    this.fixedDelta = fixedDelta;
  }

  setFixedDelta(fixedDelta: number): void {
    this.fixedDelta = fixedDelta;
  }

  addWorld(world: World, scheduler: SystemScheduler): void {
    if (this.worlds.some((e) => e.world === world)) return;
    this.worlds.push({ world, scheduler });
  }

  removeWorld(world: World): void {
    const index = this.worlds.findIndex((e) => e.world === world);
    if (index === -1) return;
    this.worlds.splice(index, 1);
  }

  update(timestamp: number, encoder: GPUCommandEncoder): void {
    if (this.lastTimestamp === -1) {
      this.lastTimestamp = timestamp;
    }

    const delta = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;
    this.accumulator += delta;

    for (const { world, scheduler } of this.worlds) {
      if (!world.getIsActive()) continue;

      while (this.accumulator >= this.fixedDelta) {
        scheduler.tickPhysics(this.fixedDelta);
        this.accumulator -= this.fixedDelta;
      }

      scheduler.tickLogic(delta);
      scheduler.tickRender(encoder);
    }
  }
}
