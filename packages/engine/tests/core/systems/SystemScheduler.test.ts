import "reflect-metadata";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { World } from "../../../src/core/ecs/World";
import { SystemScheduler } from "../../../src/core/systems/SystemScheduler";
import { System } from "../../../src/core/systems/System";
import { PhysicsSystem } from "../../../src/core/systems/PhysicsSystem";
import { RenderSystem } from "../../../src/render/systems/RenderSystem";
import { MainLoop } from "../../../src/core/loop/MainLoop";

function createWorld(active: boolean = true): World {
  const world = new World({ isActive: active });
  return world;
}

class TestLogicSystem extends System {
  initCount = 0;
  updateCount = 0;
  enableCount = 0;
  disableCount = 0;
  destroyCount = 0;
  lastDelta = 0;

  onInit(): void {
    this.initCount++;
  }
  onEnable(): void {
    this.enableCount++;
  }
  onDisable(): void {
    this.disableCount++;
  }
  onDestroy(): void {
    this.destroyCount++;
  }
  onUpdate(delta: number): void {
    this.updateCount++;
    this.lastDelta = delta;
  }
}

class TestLogicSystem2 extends System {
  updateCount = 0;
  onUpdate(delta: number): void {
    this.updateCount++;
  }
}

class TestPhysicsSystem extends PhysicsSystem {
  initCount = 0;
  updateCount = 0;
  enableCount = 0;
  disableCount = 0;
  destroyCount = 0;
  lastDelta = 0;

  onInit(): void {
    this.initCount++;
  }
  onEnable(): void {
    this.enableCount++;
  }
  onDisable(): void {
    this.disableCount++;
  }
  onDestroy(): void {
    this.destroyCount++;
  }
  onFixedUpdate(delta: number): void {
    this.updateCount++;
    this.lastDelta = delta;
  }
}

class TestRenderSystem extends RenderSystem {
  initCount = 0;
  renderCount = 0;
  enableCount = 0;
  disableCount = 0;
  destroyCount = 0;

  onInit(): void {
    this.initCount++;
  }
  onEnable(): void {
    this.enableCount++;
  }
  onDisable(): void {
    this.disableCount++;
  }
  onDestroy(): void {
    this.destroyCount++;
  }
  onRender(_ctx: GPUCommandEncoder): void {
    this.renderCount++;
  }
}

function getLogicInstance(scheduler: SystemScheduler): TestLogicSystem {
  return (scheduler as any).logicSystems[0].instance as TestLogicSystem;
}

function getPhysicsInstance(scheduler: SystemScheduler): TestPhysicsSystem {
  return (scheduler as any).physicsSystems[0].instance as TestPhysicsSystem;
}

function getRenderInstance(scheduler: SystemScheduler): TestRenderSystem {
  return (scheduler as any).renderSystems[0].instance as TestRenderSystem;
}

describe("SystemScheduler.registerLogic", () => {
  it("регистрирует систему и вызывает onInit", () => {
    const world = createWorld();
    const scheduler = new SystemScheduler(world);
    scheduler.registerLogic(TestLogicSystem);
    const instance = getLogicInstance(scheduler);
    assert.equal(instance.initCount, 1);
  });

  it("повторная регистрация одного конструктора игнорируется", () => {
    const world = createWorld();
    const scheduler = new SystemScheduler(world);
    scheduler.registerLogic(TestLogicSystem);
    scheduler.registerLogic(TestLogicSystem);
    assert.equal((scheduler as any).logicSystems.length, 1);
  });

  it("разные конструкторы регистрируются независимо", () => {
    const world = createWorld();
    const scheduler = new SystemScheduler(world);
    scheduler.registerLogic(TestLogicSystem);
    scheduler.registerLogic(TestLogicSystem2);
    assert.equal((scheduler as any).logicSystems.length, 2);
  });
});

describe("SystemScheduler.registerPhysics", () => {
  it("регистрирует физическую систему и вызывает onInit", () => {
    const world = createWorld();
    const scheduler = new SystemScheduler(world);
    scheduler.registerPhysics(TestPhysicsSystem);
    const instance = getPhysicsInstance(scheduler);
    assert.equal(instance.initCount, 1);
  });

  it("повторная регистрация игнорируется", () => {
    const world = createWorld();
    const scheduler = new SystemScheduler(world);
    scheduler.registerPhysics(TestPhysicsSystem);
    scheduler.registerPhysics(TestPhysicsSystem);
    assert.equal((scheduler as any).physicsSystems.length, 1);
  });
});

describe("SystemScheduler.registerRender", () => {
  it("регистрирует рендер систему и вызывает onInit", () => {
    const world = createWorld();
    const scheduler = new SystemScheduler(world);
    scheduler.registerRender(TestRenderSystem);
    const instance = getRenderInstance(scheduler);
    assert.equal(instance.initCount, 1);
  });

  it("повторная регистрация игнорируется", () => {
    const world = createWorld();
    const scheduler = new SystemScheduler(world);
    scheduler.registerRender(TestRenderSystem);
    scheduler.registerRender(TestRenderSystem);
    assert.equal((scheduler as any).renderSystems.length, 1);
  });
});

describe("SystemScheduler.unregister", () => {
  it("вызывает onDestroy при удалении логической системы", () => {
    const world = createWorld();
    const scheduler = new SystemScheduler(world);
    scheduler.registerLogic(TestLogicSystem);
    const instance = getLogicInstance(scheduler);
    scheduler.unregisterLogic(TestLogicSystem);
    assert.equal(instance.destroyCount, 1);
  });

  it("удаляет систему из очереди", () => {
    const world = createWorld();
    const scheduler = new SystemScheduler(world);
    scheduler.registerLogic(TestLogicSystem);
    scheduler.unregisterLogic(TestLogicSystem);
    assert.equal((scheduler as any).logicSystems.length, 0);
  });

  it("unregister несуществующей системы не бросает ошибку", () => {
    const world = createWorld();
    const scheduler = new SystemScheduler(world);
    assert.doesNotThrow(() => scheduler.unregisterLogic(TestLogicSystem));
  });

  it("вызывает onDestroy при удалении физической системы", () => {
    const world = createWorld();
    const scheduler = new SystemScheduler(world);
    scheduler.registerPhysics(TestPhysicsSystem);
    const instance = getPhysicsInstance(scheduler);
    scheduler.unregisterPhysics(TestPhysicsSystem);
    assert.equal(instance.destroyCount, 1);
  });

  it("вызывает onDestroy при удалении рендер системы", () => {
    const world = createWorld();
    const scheduler = new SystemScheduler(world);
    scheduler.registerRender(TestRenderSystem);
    const instance = getRenderInstance(scheduler);
    scheduler.unregisterRender(TestRenderSystem);
    assert.equal(instance.destroyCount, 1);
  });
});

describe("SystemScheduler.enable / disable", () => {
  it("disableLogic вызывает onDisable", () => {
    const world = createWorld();
    const scheduler = new SystemScheduler(world);
    scheduler.registerLogic(TestLogicSystem);
    const instance = getLogicInstance(scheduler);
    scheduler.disableLogic(TestLogicSystem);
    assert.equal(instance.disableCount, 1);
  });

  it("enableLogic вызывает onEnable", () => {
    const world = createWorld();
    const scheduler = new SystemScheduler(world);
    scheduler.registerLogic(TestLogicSystem);
    scheduler.disableLogic(TestLogicSystem);
    const instance = getLogicInstance(scheduler);
    scheduler.enableLogic(TestLogicSystem);
    assert.equal(instance.enableCount, 1);
  });

  it("повторный disable не вызывает onDisable снова", () => {
    const world = createWorld();
    const scheduler = new SystemScheduler(world);
    scheduler.registerLogic(TestLogicSystem);
    scheduler.disableLogic(TestLogicSystem);
    scheduler.disableLogic(TestLogicSystem);
    const instance = getLogicInstance(scheduler);
    assert.equal(instance.disableCount, 1);
  });

  it("повторный enable не вызывает onEnable снова", () => {
    const world = createWorld();
    const scheduler = new SystemScheduler(world);
    scheduler.registerLogic(TestLogicSystem);
    scheduler.enableLogic(TestLogicSystem);
    const instance = getLogicInstance(scheduler);
    assert.equal(instance.enableCount, 0);
  });

  it("задисейбленная система не тикает", () => {
    const world = createWorld();
    const scheduler = new SystemScheduler(world);
    scheduler.registerLogic(TestLogicSystem);
    scheduler.disableLogic(TestLogicSystem);
    const instance = getLogicInstance(scheduler);
    scheduler.tickLogic(0.016);
    assert.equal(instance.updateCount, 0);
  });

  it("после enable система снова тикает", () => {
    const world = createWorld();
    const scheduler = new SystemScheduler(world);
    scheduler.registerLogic(TestLogicSystem);
    scheduler.disableLogic(TestLogicSystem);
    scheduler.enableLogic(TestLogicSystem);
    const instance = getLogicInstance(scheduler);
    scheduler.tickLogic(0.016);
    assert.equal(instance.updateCount, 1);
  });
});

describe("SystemScheduler.tick", () => {
  it("tickLogic вызывает onUpdate с корректным delta", () => {
    const world = createWorld();
    const scheduler = new SystemScheduler(world);
    scheduler.registerLogic(TestLogicSystem);
    const instance = getLogicInstance(scheduler);
    scheduler.tickLogic(0.016);
    assert.equal(instance.updateCount, 1);
    assert.equal(instance.lastDelta, 0.016);
  });

  it("tickPhysics вызывает onFixedUpdate с корректным fixedDelta", () => {
    const world = createWorld();
    const scheduler = new SystemScheduler(world);
    scheduler.registerPhysics(TestPhysicsSystem);
    const instance = getPhysicsInstance(scheduler);
    scheduler.tickPhysics(0.02);
    assert.equal(instance.updateCount, 1);
    assert.equal(instance.lastDelta, 0.02);
  });

  it("tickLogic вызывает все зарегистрированные системы", () => {
    const world = createWorld();
    const scheduler = new SystemScheduler(world);
    scheduler.registerLogic(TestLogicSystem);
    scheduler.registerLogic(TestLogicSystem2);
    scheduler.tickLogic(0.016);
    const i1 = (scheduler as any).logicSystems[0].instance as TestLogicSystem;
    const i2 = (scheduler as any).logicSystems[1].instance as TestLogicSystem2;
    assert.equal(i1.updateCount, 1);
    assert.equal(i2.updateCount, 1);
  });
});

describe("MainLoop", () => {
  it("addWorld - дубликат игнорируется", () => {
    const world = createWorld();
    const scheduler = new SystemScheduler(world);
    const loop = new MainLoop();
    loop.addWorld(world, scheduler);
    loop.addWorld(world, scheduler);
    assert.equal((loop as any).worlds.length, 1);
  });

  it("removeWorld удаляет мир", () => {
    const world = createWorld();
    const scheduler = new SystemScheduler(world);
    const loop = new MainLoop();
    loop.addWorld(world, scheduler);
    loop.removeWorld(world);
    assert.equal((loop as any).worlds.length, 0);
  });

  it("неактивный мир не тикает", () => {
    const world = createWorld(false);
    const scheduler = new SystemScheduler(world);
    scheduler.registerLogic(TestLogicSystem);
    const loop = new MainLoop();
    loop.addWorld(world, scheduler);
    loop.update(0, null as any);
    loop.update(16, null as any);
    const instance = (scheduler as any).logicSystems[0]
      .instance as TestLogicSystem;
    assert.equal(instance.updateCount, 0);
  });

  it("активный мир тикает", () => {
    const world = createWorld(true);
    const scheduler = new SystemScheduler(world);
    scheduler.registerLogic(TestLogicSystem);
    const loop = new MainLoop();
    loop.addWorld(world, scheduler);
    loop.update(0, null as any);
    loop.update(16, null as any);
    const instance = (scheduler as any).logicSystems[0]
      .instance as TestLogicSystem;
    assert.equal(instance.updateCount, 2);
  });

  it("физика тикает нужное количество раз при большом delta", () => {
    const world = createWorld(true);
    const scheduler = new SystemScheduler(world);
    scheduler.registerPhysics(TestPhysicsSystem);
    const loop = new MainLoop(0.02);
    loop.addWorld(world, scheduler);
    loop.update(0, null as any);
    loop.update(110, null as any);
    const instance = getPhysicsInstance(scheduler);
    assert.equal(instance.updateCount, 5);
  });

  it("setFixedDelta меняет порог физики", () => {
    const world = createWorld(true);
    const scheduler = new SystemScheduler(world);
    scheduler.registerPhysics(TestPhysicsSystem);
    const loop = new MainLoop(0.02);
    loop.setFixedDelta(0.1);
    loop.addWorld(world, scheduler);
    loop.update(0, null as any);
    loop.update(100, null as any);
    const instance = getPhysicsInstance(scheduler);
    assert.equal(instance.updateCount, 1);
  });
});
