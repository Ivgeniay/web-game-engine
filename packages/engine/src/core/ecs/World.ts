import "reflect-metadata";
import {
  createComponentDefinition,
  growComponentBuffers,
  type ComponentBuffers,
  type ComponentConstructor,
  type ComponentDefinition,
} from "./Component";
import { EntityPool, getIndex, getGeneration, type Entity } from "./Entity";

export interface WorldOptions {
  initialCapacity?: number;
  maxComponents?: number;
  isActive?: boolean;
}

export interface QueryOptions {
  all?: ComponentConstructor[];
  any?: ComponentConstructor[];
  none?: ComponentConstructor[];
}

interface CachedQuery {
  allMask: Uint32Array;
  anyMask: Uint32Array;
  noneMask: Uint32Array;
  hasAnyMask: boolean;
  result: Entity[];
}

export class World {
  private entityPool: EntityPool;
  private components: Map<ComponentConstructor, ComponentDefinition>;
  private entityMasks: Uint32Array[];
  private capacity: number;
  private maskSize: number;
  private nextBitIndex: number = 0;
  private maxEntityIndex: number = -1;
  private queryCache: Map<string, CachedQuery> = new Map();
  private isActive: boolean = false;

  constructor(options: WorldOptions = {}) {
    this.capacity = options.initialCapacity ?? 256;
    const maxComponents = options.maxComponents ?? 256;
    this.isActive = options.isActive ?? false;
    this.maskSize = Math.ceil(maxComponents / 32);
    this.entityPool = new EntityPool();
    this.components = new Map();
    this.entityMasks = Array.from(
      { length: this.maskSize },
      () => new Uint32Array(this.capacity),
    );
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  setActive(value: boolean) {
    this.isActive = value;
  }

  registerComponent(constructor: ComponentConstructor): void {
    if (this.components.has(constructor)) return;
    const bitIndex = this.nextBitIndex++;
    const definition = createComponentDefinition(
      constructor,
      this.capacity,
      bitIndex,
    );
    this.components.set(constructor, definition);
  }

  createEntity(): Entity {
    const entity = this.entityPool.create();
    const index = getIndex(entity);
    if (index >= this.capacity) {
      this.grow();
    }
    if (index > this.maxEntityIndex) {
      this.maxEntityIndex = index;
    }
    return entity;
  }

  destroyEntity(entity: Entity): void {
    if (!this.entityPool.isAlive(entity)) return;
    const index = getIndex(entity);
    for (let i = 0; i < this.maskSize; i++) {
      this.entityMasks[i][index] = 0;
    }
    this.removeEntityFromCache(entity);
    this.entityPool.destroy(entity);
  }

  addComponent(entity: Entity, constructor: ComponentConstructor): void {
    if (!this.entityPool.isAlive(entity)) return;
    const definition = this.components.get(constructor);
    if (!definition) return;
    const index = getIndex(entity);
    const wordIndex = Math.floor(definition.bitIndex / 32);
    const bitIndex = definition.bitIndex % 32;
    this.entityMasks[wordIndex][index] |= 1 << bitIndex;
    this.updateQueryCache(entity);
  }

  removeComponent(entity: Entity, constructor: ComponentConstructor): void {
    if (!this.entityPool.isAlive(entity)) return;
    const definition = this.components.get(constructor);
    if (!definition) return;
    const index = getIndex(entity);
    const wordIndex = Math.floor(definition.bitIndex / 32);
    const bitIndex = definition.bitIndex % 32;
    this.entityMasks[wordIndex][index] &= ~(1 << bitIndex);
    this.updateQueryCache(entity);
  }

  getComponent(
    constructor: ComponentConstructor,
  ): ComponentBuffers | undefined {
    const definition = this.components.get(constructor);
    if (!definition) return undefined;
    return definition.buffers;
  }

  isAlive(entity: Entity): boolean {
    return this.entityPool.isAlive(entity);
  }

  getEntityIndex(entity: Entity): number {
    return getIndex(entity);
  }

  getEntityGeneration(entity: Entity): number {
    return getGeneration(entity);
  }

  query(options: QueryOptions): Entity[] {
    const key = this.buildCacheKey(options);
    const cached = this.queryCache.get(key);

    if (cached) {
      return cached.result;
    }

    const allMask = this.buildMask(options.all ?? []);
    const anyMask = this.buildMask(options.any ?? []);
    const noneMask = this.buildMask(options.none ?? []);
    const hasAnyMask = anyMask.some((word) => word !== 0);
    const result = this.executeQuery(allMask, anyMask, noneMask, hasAnyMask);

    this.queryCache.set(key, {
      allMask,
      anyMask,
      noneMask,
      hasAnyMask,
      result,
    });

    return result;
  }

  private updateQueryCache(entity: Entity): void {
    const index = getIndex(entity);
    for (const cached of this.queryCache.values()) {
      const matches = this.matchesQuery(
        index,
        cached.allMask,
        cached.anyMask,
        cached.noneMask,
        cached.hasAnyMask,
      );
      const pos = cached.result.indexOf(entity);
      if (matches && pos === -1) {
        cached.result.push(entity);
      } else if (!matches && pos !== -1) {
        cached.result.splice(pos, 1);
      }
    }
  }

  private removeEntityFromCache(entity: Entity): void {
    for (const cached of this.queryCache.values()) {
      const pos = cached.result.indexOf(entity);
      if (pos !== -1) {
        cached.result.splice(pos, 1);
      }
    }
  }

  private executeQuery(
    allMask: Uint32Array,
    anyMask: Uint32Array,
    noneMask: Uint32Array,
    hasAnyMask: boolean,
  ): Entity[] {
    const result: Entity[] = [];
    for (let index = 0; index <= this.maxEntityIndex; index++) {
      const entity = this.entityPool.getEntityByIndex(index);
      if (!this.entityPool.isAlive(entity)) continue;
      if (this.matchesQuery(index, allMask, anyMask, noneMask, hasAnyMask)) {
        result.push(entity);
      }
    }
    return result;
  }

  private buildCacheKey(options: QueryOptions): string {
    const toIds = (constructors: ComponentConstructor[] = []) =>
      constructors
        .map((c) => this.components.get(c)?.bitIndex ?? -1)
        .sort((a, b) => a - b)
        .join(",");

    return `${toIds(options.all)}|${toIds(options.any)}|${toIds(options.none)}`;
  }

  private buildMask(constructors: ComponentConstructor[]): Uint32Array {
    const mask = new Uint32Array(this.maskSize);
    for (const constructor of constructors) {
      const definition = this.components.get(constructor);
      if (!definition) continue;
      const wordIndex = Math.floor(definition.bitIndex / 32);
      const bitIndex = definition.bitIndex % 32;
      mask[wordIndex] |= 1 << bitIndex;
    }
    return mask;
  }

  private matchesQuery(
    index: number,
    allMask: Uint32Array,
    anyMask: Uint32Array,
    noneMask: Uint32Array,
    hasAnyMask: boolean,
  ): boolean {
    for (let i = 0; i < this.maskSize; i++) {
      const entityWord = this.entityMasks[i][index];
      if ((entityWord & allMask[i]) !== allMask[i]) return false;
      if (noneMask[i] !== 0 && (entityWord & noneMask[i]) !== 0) return false;
    }

    if (hasAnyMask) {
      for (let i = 0; i < this.maskSize; i++) {
        if ((this.entityMasks[i][index] & anyMask[i]) !== 0) return true;
      }
      return false;
    }

    return true;
  }

  private grow(): void {
    const newCapacity = this.capacity * 2;

    for (const definition of this.components.values()) {
      growComponentBuffers(definition, newCapacity);
    }

    this.entityMasks = Array.from({ length: this.maskSize }, (_, i) => {
      const newMask = new Uint32Array(newCapacity);
      newMask.set(this.entityMasks[i]!);
      return newMask;
    });

    this.capacity = newCapacity;
  }
}
