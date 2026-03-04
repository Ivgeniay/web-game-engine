import type { World } from "../ecs/World";
import type { System } from "./System";
import type { PhysicsSystem } from "./PhysicsSystem";
import type { RenderSystem } from "../../render/systems/RenderSystem";

type SystemConstructor<T> = new (world: World) => T;

interface SystemEntry<T> {
  instance: T;
  constructor: SystemConstructor<T>;
  enabled: boolean;
}

export class SystemScheduler {
  private readonly world: World;
  private physicsSystems: SystemEntry<PhysicsSystem>[] = [];
  private logicSystems: SystemEntry<System>[] = [];
  private renderSystems: SystemEntry<RenderSystem>[] = [];

  constructor(world: World) {
    this.world = world;
  }

  registerPhysics(constructor: SystemConstructor<PhysicsSystem>): void {
    if (this.physicsSystems.some((e) => e.constructor === constructor)) return;
    const instance = new constructor(this.world);
    instance.onInit();
    this.physicsSystems.push({ instance, constructor, enabled: true });
  }

  registerLogic(constructor: SystemConstructor<System>): void {
    if (this.logicSystems.some((e) => e.constructor === constructor)) return;
    const instance = new constructor(this.world);
    instance.onInit();
    this.logicSystems.push({ instance, constructor, enabled: true });
  }

  registerRender(constructor: SystemConstructor<RenderSystem>): void {
    if (this.renderSystems.some((e) => e.constructor === constructor)) return;
    const instance = new constructor(this.world);
    instance.onInit();
    this.renderSystems.push({ instance, constructor, enabled: true });
  }

  unregisterPhysics(constructor: SystemConstructor<PhysicsSystem>): void {
    const index = this.physicsSystems.findIndex(
      (e) => e.constructor === constructor,
    );
    if (index === -1) return;
    this.physicsSystems[index]!.instance.onDestroy();
    this.physicsSystems.splice(index, 1);
  }

  unregisterLogic(constructor: SystemConstructor<System>): void {
    const index = this.logicSystems.findIndex(
      (e) => e.constructor === constructor,
    );
    if (index === -1) return;
    this.logicSystems[index]!.instance.onDestroy();
    this.logicSystems.splice(index, 1);
  }

  unregisterRender(constructor: SystemConstructor<RenderSystem>): void {
    const index = this.renderSystems.findIndex(
      (e) => e.constructor === constructor,
    );
    if (index === -1) return;
    this.renderSystems[index]!.instance.onDestroy();
    this.renderSystems.splice(index, 1);
  }

  enablePhysics(constructor: SystemConstructor<PhysicsSystem>): void {
    const entry = this.physicsSystems.find(
      (e) => e.constructor === constructor,
    );
    if (!entry || entry.enabled) return;
    entry.enabled = true;
    entry.instance.onEnable();
  }

  disablePhysics(constructor: SystemConstructor<PhysicsSystem>): void {
    const entry = this.physicsSystems.find(
      (e) => e.constructor === constructor,
    );
    if (!entry || !entry.enabled) return;
    entry.enabled = false;
    entry.instance.onDisable();
  }

  enableLogic(constructor: SystemConstructor<System>): void {
    const entry = this.logicSystems.find((e) => e.constructor === constructor);
    if (!entry || entry.enabled) return;
    entry.enabled = true;
    entry.instance.onEnable();
  }

  disableLogic(constructor: SystemConstructor<System>): void {
    const entry = this.logicSystems.find((e) => e.constructor === constructor);
    if (!entry || !entry.enabled) return;
    entry.enabled = false;
    entry.instance.onDisable();
  }

  enableRender(constructor: SystemConstructor<RenderSystem>): void {
    const entry = this.renderSystems.find((e) => e.constructor === constructor);
    if (!entry || entry.enabled) return;
    entry.enabled = true;
    entry.instance.onEnable();
  }

  disableRender(constructor: SystemConstructor<RenderSystem>): void {
    const entry = this.renderSystems.find((e) => e.constructor === constructor);
    if (!entry || !entry.enabled) return;
    entry.enabled = false;
    entry.instance.onDisable();
  }

  tickPhysics(fixedDelta: number): void {
    for (const entry of this.physicsSystems) {
      if (entry.enabled) entry.instance.onFixedUpdate(fixedDelta);
    }
  }

  tickLogic(delta: number): void {
    for (const entry of this.logicSystems) {
      if (entry.enabled) entry.instance.onUpdate(delta);
    }
  }

  tickRender(encoder: GPUCommandEncoder): void {
    for (const entry of this.renderSystems) {
      if (entry.enabled) entry.instance.onRender(encoder);
    }
  }
}
