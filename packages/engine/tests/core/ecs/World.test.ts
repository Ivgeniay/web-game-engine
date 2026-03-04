import { describe, it } from "node:test";
import "reflect-metadata";
import assert from "node:assert/strict";
import { World } from "../../../src/core/ecs/World";
import {
  f32,
  i32,
} from "../../../src/general/decorators/components/field_decorators";

class Position {
  @f32 x: number = 0;
  @f32 y: number = 0;
  @f32 z: number = 0;
}

class Velocity {
  @f32 vx: number = 0;
  @f32 vy: number = 0;
}

class Health {
  @i32 hp: number = 0;
}

class Empty {}

function createWorld() {
  const world = new World();
  world.registerComponent(Position);
  world.registerComponent(Velocity);
  world.registerComponent(Health);
  return world;
}

describe("World.registerComponent", () => {
  it("регистрирует компонент без ошибок", () => {
    const world = new World();
    assert.doesNotThrow(() => world.registerComponent(Position));
  });

  it("повторная регистрация одного компонента не бросает ошибку", () => {
    const world = new World();
    world.registerComponent(Position);
    assert.doesNotThrow(() => world.registerComponent(Position));
  });

  it("повторная регистрация не создаёт дубликат буферов", () => {
    const world = new World();
    world.registerComponent(Position);
    world.registerComponent(Position);
    const buffers = world.getComponent(Position);
    assert.ok(buffers);
    assert.equal(Object.keys(buffers).length, 3);
  });

  it("компонент без полей регистрируется без ошибок", () => {
    const world = new World();
    assert.doesNotThrow(() => world.registerComponent(Empty));
  });
});

describe("World.createEntity / destroyEntity", () => {
  it("созданная сущность живёт", () => {
    const world = createWorld();
    const e = world.createEntity();
    assert.ok(world.isAlive(e));
  });

  it("после destroy сущность мертва", () => {
    const world = createWorld();
    const e = world.createEntity();
    world.destroyEntity(e);
    assert.ok(!world.isAlive(e));
  });

  it("повторный destroy не бросает ошибку", () => {
    const world = createWorld();
    const e = world.createEntity();
    world.destroyEntity(e);
    assert.doesNotThrow(() => world.destroyEntity(e));
  });

  it("destroy устаревшего Entity не убивает новую сущность с тем же индексом", () => {
    const world = createWorld();
    const old = world.createEntity();
    world.destroyEntity(old);
    const fresh = world.createEntity();
    world.destroyEntity(old);
    assert.ok(world.isAlive(fresh));
  });

  it("создание множества сущностей работает стабильно", () => {
    const world = createWorld();
    const entities = Array.from({ length: 1000 }, () => world.createEntity());
    assert.ok(entities.every((e) => world.isAlive(e)));
  });

  it("индексы переиспользуются после destroy", () => {
    const world = createWorld();
    const e0 = world.createEntity();
    world.destroyEntity(e0);
    const e1 = world.createEntity();
    assert.ok(world.isAlive(e1));
    assert.ok(!world.isAlive(e0));
  });
});

describe("World.addComponent / removeComponent", () => {
  it("добавление компонента не бросает ошибку", () => {
    const world = createWorld();
    const e = world.createEntity();
    assert.doesNotThrow(() => world.addComponent(e, Position));
  });

  it("удаление компонента не бросает ошибку", () => {
    const world = createWorld();
    const e = world.createEntity();
    world.addComponent(e, Position);
    assert.doesNotThrow(() => world.removeComponent(e, Position));
  });

  it("addComponent для мёртвой сущности игнорируется", () => {
    const world = createWorld();
    const e = world.createEntity();
    world.destroyEntity(e);
    assert.doesNotThrow(() => world.addComponent(e, Position));
    assert.equal(world.query({ all: [Position] }).length, 0);
  });

  it("removeComponent для мёртвой сущности игнорируется", () => {
    const world = createWorld();
    const e = world.createEntity();
    world.addComponent(e, Position);
    world.destroyEntity(e);
    assert.doesNotThrow(() => world.removeComponent(e, Position));
  });

  it("addComponent для незарегистрированного компонента игнорируется", () => {
    const world = createWorld();
    const e = world.createEntity();
    assert.doesNotThrow(() => world.addComponent(e, Empty));
  });

  it("removeComponent для незарегистрированного компонента игнорируется", () => {
    const world = createWorld();
    const e = world.createEntity();
    assert.doesNotThrow(() => world.removeComponent(e, Empty));
  });

  it("повторное добавление одного компонента не ломает состояние", () => {
    const world = createWorld();
    const e = world.createEntity();
    world.addComponent(e, Position);
    world.addComponent(e, Position);
    assert.equal(world.query({ all: [Position] }).length, 1);
  });

  it("удаление незадобавленного компонента не ломает состояние", () => {
    const world = createWorld();
    const e = world.createEntity();
    assert.doesNotThrow(() => world.removeComponent(e, Position));
    assert.equal(world.query({ all: [Position] }).length, 0);
  });
});

describe("World.getComponent", () => {
  it("возвращает буферы для зарегистрированного компонента", () => {
    const world = createWorld();
    const buffers = world.getComponent(Position);
    assert.ok(buffers);
    assert.ok("x" in buffers);
    assert.ok("y" in buffers);
    assert.ok("z" in buffers);
  });

  it("возвращает undefined для незарегистрированного компонента", () => {
    const world = createWorld();
    assert.equal(world.getComponent(Empty), undefined);
  });
});

describe("World.query - all", () => {
  it("возвращает сущности у которых есть все указанные компоненты", () => {
    const world = createWorld();
    const e0 = world.createEntity();
    const e1 = world.createEntity();
    const e2 = world.createEntity();
    world.addComponent(e0, Position);
    world.addComponent(e0, Velocity);
    world.addComponent(e1, Position);
    world.addComponent(e2, Velocity);
    const result = world.query({ all: [Position, Velocity] });
    assert.equal(result.length, 1);
    assert.ok(result.includes(e0));
  });

  it("не возвращает сущности у которых нет хотя бы одного компонента", () => {
    const world = createWorld();
    const e = world.createEntity();
    world.addComponent(e, Position);
    const result = world.query({ all: [Position, Velocity] });
    assert.equal(result.length, 0);
  });

  it("пустой all возвращает все живые сущности", () => {
    const world = createWorld();
    const e0 = world.createEntity();
    const e1 = world.createEntity();
    const result = world.query({});
    assert.equal(result.length, 2);
    assert.ok(result.includes(e0));
    assert.ok(result.includes(e1));
  });
});

describe("World.query - any", () => {
  it("возвращает сущности у которых есть хотя бы один из компонентов", () => {
    const world = createWorld();
    const e0 = world.createEntity();
    const e1 = world.createEntity();
    const e2 = world.createEntity();
    world.addComponent(e0, Position);
    world.addComponent(e1, Velocity);
    const result = world.query({ any: [Position, Velocity] });
    assert.equal(result.length, 2);
    assert.ok(result.includes(e0));
    assert.ok(result.includes(e1));
    assert.ok(!result.includes(e2));
  });
});

describe("World.query - none", () => {
  it("исключает сущности у которых есть указанный компонент", () => {
    const world = createWorld();
    const e0 = world.createEntity();
    const e1 = world.createEntity();
    world.addComponent(e0, Position);
    world.addComponent(e1, Position);
    world.addComponent(e1, Velocity);
    const result = world.query({ all: [Position], none: [Velocity] });
    assert.equal(result.length, 1);
    assert.ok(result.includes(e0));
  });
});

describe("World.query - комбинации", () => {
  it("all + none работают вместе корректно", () => {
    const world = createWorld();
    const e0 = world.createEntity();
    const e1 = world.createEntity();
    const e2 = world.createEntity();
    world.addComponent(e0, Position);
    world.addComponent(e1, Position);
    world.addComponent(e1, Health);
    world.addComponent(e2, Health);
    const result = world.query({ all: [Position], none: [Health] });
    assert.equal(result.length, 1);
    assert.ok(result.includes(e0));
  });

  it("all + any + none работают вместе", () => {
    const world = createWorld();
    const e0 = world.createEntity();
    const e1 = world.createEntity();
    const e2 = world.createEntity();
    world.addComponent(e0, Position);
    world.addComponent(e0, Velocity);
    world.addComponent(e1, Position);
    world.addComponent(e1, Health);
    world.addComponent(e1, Velocity);
    world.addComponent(e2, Position);
    world.addComponent(e2, Velocity);
    world.addComponent(e2, Health);
    const result = world.query({
      all: [Position],
      any: [Velocity],
      none: [Health],
    });
    assert.equal(result.length, 1);
    assert.ok(result.includes(e0));
  });

  it("мёртвые сущности не попадают в результат query", () => {
    const world = createWorld();
    const e0 = world.createEntity();
    const e1 = world.createEntity();
    world.addComponent(e0, Position);
    world.addComponent(e1, Position);
    world.destroyEntity(e0);
    const result = world.query({ all: [Position] });
    assert.equal(result.length, 1);
    assert.ok(result.includes(e1));
  });
});

describe("World.query - кеш", () => {
  it("повторный query возвращает тот же результат", () => {
    const world = createWorld();
    const e = world.createEntity();
    world.addComponent(e, Position);
    const r0 = world.query({ all: [Position] });
    const r1 = world.query({ all: [Position] });
    assert.deepEqual(r0, r1);
  });

  it("кеш инвалидируется после addComponent", () => {
    const world = createWorld();
    const e0 = world.createEntity();
    const e1 = world.createEntity();
    world.addComponent(e0, Position);
    const before = world.query({ all: [Position] });
    assert.equal(before.length, 1);
    world.addComponent(e1, Position);
    const after = world.query({ all: [Position] });
    assert.equal(after.length, 2);
  });

  it("кеш инвалидируется после removeComponent", () => {
    const world = createWorld();
    const e = world.createEntity();
    world.addComponent(e, Position);
    const before = world.query({ all: [Position] });
    assert.equal(before.length, 1);
    world.removeComponent(e, Position);
    const after = world.query({ all: [Position] });
    assert.equal(after.length, 0);
  });

  it("кеш инвалидируется после destroyEntity", () => {
    const world = createWorld();
    const e = world.createEntity();
    world.addComponent(e, Position);
    const before = world.query({ all: [Position] });
    assert.equal(before.length, 1);
    world.destroyEntity(e);
    const after = world.query({ all: [Position] });
    assert.equal(after.length, 0);
  });
});

describe("World - обычное использование", () => {
  it("типичный игровой цикл - создание перемещающихся сущностей", () => {
    const world = createWorld();

    const player = world.createEntity();
    world.addComponent(player, Position);
    world.addComponent(player, Velocity);
    world.addComponent(player, Health);

    const enemy0 = world.createEntity();
    world.addComponent(enemy0, Position);
    world.addComponent(enemy0, Velocity);
    world.addComponent(enemy0, Health);

    const enemy1 = world.createEntity();
    world.addComponent(enemy1, Position);
    world.addComponent(enemy1, Health);

    const static0 = world.createEntity();
    world.addComponent(static0, Position);

    const movable = world.query({ all: [Position, Velocity] });
    assert.equal(movable.length, 2);
    assert.ok(movable.includes(player));
    assert.ok(movable.includes(enemy0));

    const alive = world.query({ all: [Health] });
    assert.equal(alive.length, 3);

    world.destroyEntity(enemy0);

    const movableAfter = world.query({ all: [Position, Velocity] });
    assert.equal(movableAfter.length, 1);
    assert.ok(movableAfter.includes(player));
  });

  it("grow - world корректно расширяется при превышении capacity", () => {
    const world = new World({ initialCapacity: 4 });
    world.registerComponent(Position);

    const entities = Array.from({ length: 10 }, () => {
      const e = world.createEntity();
      world.addComponent(e, Position);
      return e;
    });

    const result = world.query({ all: [Position] });
    assert.equal(result.length, 10);
    assert.ok(entities.every((e) => world.isAlive(e)));
  });
});

describe("World.query - реактивный кеш", () => {
  it("результат обновляется без повторного вызова query после addComponent", () => {
    const world = createWorld();
    const e0 = world.createEntity();
    const e1 = world.createEntity();
    world.addComponent(e0, Position);

    const result = world.query({ all: [Position] });
    assert.equal(result.length, 1);

    world.addComponent(e1, Position);
    assert.equal(result.length, 2);
    assert.ok(result.includes(e1));
  });

  it("результат обновляется без повторного вызова query после removeComponent", () => {
    const world = createWorld();
    const e = world.createEntity();
    world.addComponent(e, Position);

    const result = world.query({ all: [Position] });
    assert.equal(result.length, 1);

    world.removeComponent(e, Position);
    assert.equal(result.length, 0);
  });

  it("результат обновляется без повторного вызова query после destroyEntity", () => {
    const world = createWorld();
    const e = world.createEntity();
    world.addComponent(e, Position);

    const result = world.query({ all: [Position] });
    assert.equal(result.length, 1);

    world.destroyEntity(e);
    assert.equal(result.length, 0);
  });

  it("query возвращает один и тот же массив по ссылке", () => {
    const world = createWorld();
    const r0 = world.query({ all: [Position] });
    const r1 = world.query({ all: [Position] });
    assert.equal(r0, r1);
  });

  it("несколько query с компонентами в разном порядке используют один кеш", () => {
    const world = createWorld();
    const e = world.createEntity();
    world.addComponent(e, Position);
    world.addComponent(e, Velocity);

    const r0 = world.query({ all: [Position, Velocity] });
    const r1 = world.query({ all: [Velocity, Position] });
    assert.equal(r0, r1);
  });
});

describe("World.query - порядок операций", () => {
  it("компонент добавлен до первого вызова query - результат корректен", () => {
    const world = createWorld();
    const e = world.createEntity();
    world.addComponent(e, Position);
    world.addComponent(e, Velocity);

    const result = world.query({ all: [Position, Velocity] });
    assert.equal(result.length, 1);
    assert.ok(result.includes(e));
  });

  it("добавление и немедленное удаление компонента - entity не попадает в кеш", () => {
    const world = createWorld();
    const e = world.createEntity();

    const result = world.query({ all: [Position] });
    assert.equal(result.length, 0);

    world.addComponent(e, Position);
    world.removeComponent(e, Position);
    assert.equal(result.length, 0);
  });

  it("уничтожение и создание нового entity с тем же индексом - старый не появляется в кеше", () => {
    const world = createWorld();
    const old = world.createEntity();
    world.addComponent(old, Position);

    const result = world.query({ all: [Position] });
    assert.equal(result.length, 1);

    world.destroyEntity(old);
    assert.equal(result.length, 0);

    const fresh = world.createEntity();
    assert.equal(result.length, 0);
    assert.ok(!result.includes(fresh));
  });

  it("несколько активных query обновляются одновременно", () => {
    const world = createWorld();
    const e = world.createEntity();

    const rPosition = world.query({ all: [Position] });
    const rVelocity = world.query({ all: [Velocity] });
    const rBoth = world.query({ all: [Position, Velocity] });

    world.addComponent(e, Position);
    assert.equal(rPosition.length, 1);
    assert.equal(rVelocity.length, 0);
    assert.equal(rBoth.length, 0);

    world.addComponent(e, Velocity);
    assert.equal(rPosition.length, 1);
    assert.equal(rVelocity.length, 1);
    assert.equal(rBoth.length, 1);

    world.removeComponent(e, Position);
    assert.equal(rPosition.length, 0);
    assert.equal(rVelocity.length, 1);
    assert.equal(rBoth.length, 0);
  });
});
