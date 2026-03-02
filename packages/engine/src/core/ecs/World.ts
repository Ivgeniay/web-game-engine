import "reflect-metadata";
import {
  createComponentDefinition,
  growComponentBuffers,
  type ComponentBuffers,
  type ComponentConstructor,
  type ComponentDefinition,
} from "./Component";
import { EntityPool, type Entity } from "./Entity";

export interface WorldOptions {
  initialCapacity?: number;
  maxComponents?: number;
}

export interface QueryOptions {
  all?: ComponentConstructor[];
  any?: ComponentConstructor[];
  none?: ComponentConstructor[];
}

export class World {
  private entityPool: EntityPool;
  private components: Map<ComponentConstructor, ComponentDefinition>;
  private entityMasks: Uint32Array[];
  private capacity: number;
  private maskSize: number;
  private nextBitIndex: number = 0;
  private maxEntityId: number = 0;

  constructor(options: WorldOptions = {}) {
    this.capacity = options.initialCapacity ?? 256;
    const maxComponents = options.maxComponents ?? 256;
    this.maskSize = Math.ceil(maxComponents / 32);
    this.entityPool = new EntityPool();
    this.components = new Map();
    this.entityMasks = Array.from(
      { length: this.maskSize },
      () => new Uint32Array(this.capacity),
    );
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
    if (entity >= this.capacity) {
      this.grow();
    }
    if (entity > this.maxEntityId) {
      this.maxEntityId = entity;
    }
    return entity;
  }

  destroyEntity(entity: Entity): void {
    for (let i = 0; i < this.maskSize; i++) {
      this.entityMasks[i][entity] = 0;
    }
    this.entityPool.destroy(entity);
  }

  addComponent(entity: Entity, constructor: ComponentConstructor): void {
    const definition = this.components.get(constructor);
    if (!definition) return;
    const wordIndex = Math.floor(definition.bitIndex / 32);
    const bitIndex = definition.bitIndex % 32;
    this.entityMasks[wordIndex][entity] |= 1 << bitIndex;
  }

  removeComponent(entity: Entity, constructor: ComponentConstructor): void {
    const definition = this.components.get(constructor);
    if (!definition) return;
    const wordIndex = Math.floor(definition.bitIndex / 32);
    const bitIndex = definition.bitIndex % 32;
    this.entityMasks[wordIndex][entity] &= ~(1 << bitIndex);
  }

  getComponent(
    constructor: ComponentConstructor,
  ): ComponentBuffers | undefined {
    const definition = this.components.get(constructor);
    if (!definition) return undefined;
    return definition.buffers;
  }

  query(options: QueryOptions): Entity[] {
    const allMask = this.buildMask(options.all ?? []);
    const anyMask = this.buildMask(options.any ?? []);
    const noneMask = this.buildMask(options.none ?? []);
    const hasAnyMask = anyMask.some((word) => word !== 0);

    // let hasAnyMask = false;
    // for (let i = 0; i < this.maskSize; i++) {
    //   if (anyMask[i] !== 0) {
    //     hasAnyMask = true;
    //     break;
    //   }
    // }

    const result: Entity[] = [];

    for (let entity = 0; entity <= this.maxEntityId; entity++) {
      if (this.matchesQuery(entity, allMask, anyMask, noneMask, hasAnyMask)) {
        result.push(entity);
      }
    }

    return result;
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
    entity: Entity,
    allMask: Uint32Array,
    anyMask: Uint32Array,
    noneMask: Uint32Array,
    hasAnyMask: boolean,
  ): boolean {
    for (let i = 0; i < this.maskSize; i++) {
      const entityWord = this.entityMasks[i][entity];
      if ((entityWord & allMask[i]) !== allMask[i]) return false;
      if (noneMask[i] !== 0 && (entityWord & noneMask[i]) !== 0) return false;
    }

    if (hasAnyMask) {
      for (let i = 0; i < this.maskSize; i++) {
        if ((this.entityMasks[i][entity] & anyMask[i]) !== 0) return true;
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
      newMask.set(this.entityMasks[i]);
      return newMask;
    });

    this.capacity = newCapacity;
  }
}
