import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  EntityPool,
  getIndex,
  getGeneration,
  MAX_ENTITIES,
} from "../../../src/core/ecs/Entity";

describe("getIndex / getGeneration", () => {
  it("распаковывает индекс и поколение из свежей сущности", () => {
    const pool = new EntityPool();
    const entity = pool.create();
    assert.equal(getIndex(entity), 0);
    assert.equal(getGeneration(entity), 0);
  });

  it("распаковывает корректный индекс для нескольких сущностей", () => {
    const pool = new EntityPool();
    const e0 = pool.create();
    const e1 = pool.create();
    const e2 = pool.create();
    assert.equal(getIndex(e0), 0);
    assert.equal(getIndex(e1), 1);
    assert.equal(getIndex(e2), 2);
  });

  it("поколение 0 для новых сущностей", () => {
    const pool = new EntityPool();
    const e0 = pool.create();
    const e1 = pool.create();
    assert.equal(getGeneration(e0), 0);
    assert.equal(getGeneration(e1), 0);
  });
});

describe("EntityPool.create", () => {
  it("возвращает сущность с корректным индексом", () => {
    const pool = new EntityPool();
    const entity = pool.create();
    assert.equal(getIndex(entity), 0);
  });

  it("каждая новая сущность получает уникальный индекс", () => {
    const pool = new EntityPool();
    const entities = Array.from({ length: 10 }, () => pool.create());
    const indices = entities.map(getIndex);
    const unique = new Set(indices);
    assert.equal(unique.size, 10);
  });

  it("size увеличивается при create", () => {
    const pool = new EntityPool();
    pool.create();
    pool.create();
    assert.equal(pool.size, 2);
  });

  it("переиспользует индекс после destroy с новым поколением", () => {
    const pool = new EntityPool();
    const e0 = pool.create();
    pool.destroy(e0);
    const e1 = pool.create();
    assert.equal(getIndex(e0), getIndex(e1));
    assert.equal(getGeneration(e1), getGeneration(e0) + 1);
  });

  it("переиспользует индекс в порядке LIFO", () => {
    const pool = new EntityPool();
    const e0 = pool.create();
    const e1 = pool.create();
    pool.destroy(e1);
    pool.destroy(e0);
    const r0 = pool.create();
    const r1 = pool.create();
    assert.equal(getIndex(r0), getIndex(e0));
    assert.equal(getIndex(r1), getIndex(e1));
  });
});

describe("EntityPool.destroy", () => {
  it("size уменьшается при destroy", () => {
    const pool = new EntityPool();
    const e = pool.create();
    pool.destroy(e);
    assert.equal(pool.size, 0);
  });

  it("повторный destroy одной сущности не меняет size", () => {
    const pool = new EntityPool();
    const e = pool.create();
    pool.destroy(e);
    pool.destroy(e);
    assert.equal(pool.size, 0);
  });

  it("destroy устаревшего Entity не влияет на пул", () => {
    const pool = new EntityPool();
    const old = pool.create();
    pool.destroy(old);
    const fresh = pool.create();
    pool.destroy(old);
    assert.equal(pool.size, 1);
    assert.ok(pool.isAlive(fresh));
  });
});

describe("EntityPool.isAlive", () => {
  it("возвращает true для живой сущности", () => {
    const pool = new EntityPool();
    const e = pool.create();
    assert.ok(pool.isAlive(e));
  });

  it("возвращает false после destroy", () => {
    const pool = new EntityPool();
    const e = pool.create();
    pool.destroy(e);
    assert.ok(!pool.isAlive(e));
  });

  it("старый Entity невалиден после переиспользования индекса", () => {
    const pool = new EntityPool();
    const old = pool.create();
    pool.destroy(old);
    pool.create();
    assert.ok(!pool.isAlive(old));
  });

  it("новый Entity с тем же индексом валиден", () => {
    const pool = new EntityPool();
    const old = pool.create();
    pool.destroy(old);
    const fresh = pool.create();
    assert.ok(pool.isAlive(fresh));
  });
});

describe("EntityPool.getEntityByIndex", () => {
  it("возвращает корректный Entity по индексу", () => {
    const pool = new EntityPool();
    const e = pool.create();
    const byIndex = pool.getEntityByIndex(getIndex(e));
    assert.equal(e, byIndex);
  });

  it("бросает ошибку для несуществующего индекса", () => {
    const pool = new EntityPool();
    assert.throws(() => pool.getEntityByIndex(999));
  });
});

describe("EntityPool - граничные значения", () => {
  it("поколение корректно инкрементируется несколько раз", () => {
    const pool = new EntityPool();
    const e0 = pool.create();
    pool.destroy(e0);
    const e1 = pool.create();
    pool.destroy(e1);
    const e2 = pool.create();
    assert.equal(getGeneration(e2), 2);
  });

  it("MAX_ENTITIES определён и больше нуля", () => {
    assert.ok(MAX_ENTITIES > 0);
  });

  it("создание большого количества сущностей без ошибок", () => {
    const pool = new EntityPool();
    const count = 10000;
    const entities = Array.from({ length: count }, () => pool.create());
    assert.equal(pool.size, count);
    assert.equal(entities.length, count);
  });

  it("все сущности живы после массового создания", () => {
    const pool = new EntityPool();
    const entities = Array.from({ length: 1000 }, () => pool.create());
    assert.ok(entities.every((e) => pool.isAlive(e)));
  });

  it("после массового destroy все мертвы", () => {
    const pool = new EntityPool();
    const entities = Array.from({ length: 1000 }, () => pool.create());
    entities.forEach((e) => pool.destroy(e));
    assert.equal(pool.size, 0);
    assert.ok(entities.every((e) => !pool.isAlive(e)));
  });
});
