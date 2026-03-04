export type Entity = number & { readonly __hide_property: unique symbol };

const INDEX_BITS = 22;
const GENERATION_BITS = 10;

const INDEX_MASK = (1 << INDEX_BITS) - 1;
const GENERATION_MASK = (1 << GENERATION_BITS) - 1;

export const MAX_ENTITIES = INDEX_MASK;

export function getIndex(entity: Entity): number {
  return entity & INDEX_MASK;
}

export function getGeneration(entity: Entity): number {
  return (entity >>> INDEX_BITS) & GENERATION_MASK;
}

function makeEntity(index: number, generation: number): Entity {
  return ((generation & GENERATION_MASK) * (INDEX_MASK + 1) +
    (index & INDEX_MASK)) as Entity;
}

interface PoolSlot {
  generation: number;
  alive: boolean;
}

export class EntityPool {
  private slots: PoolSlot[] = [];
  private recycled: number[] = [];
  private _size: number = 0;

  create(): Entity {
    this._size++;

    if (this.recycled.length > 0) {
      const index = this.recycled.pop()!;
      const slot = this.slots[index]!;
      slot.alive = true;
      return makeEntity(index, slot.generation);
    }

    const index = this.slots.length;
    if (index > MAX_ENTITIES) {
      throw new Error(
        `EntityPool: exceeded maximum entity count of ${MAX_ENTITIES}`,
      );
    }

    this.slots.push({ generation: 0, alive: true });
    return makeEntity(index, 0);
  }

  destroy(entity: Entity): void {
    const index = getIndex(entity);
    const slot = this.slots[index];

    if (!slot || !slot.alive || slot.generation !== getGeneration(entity))
      return;

    slot.alive = false;
    slot.generation = (slot.generation + 1) & GENERATION_MASK;
    this._size--;
    this.recycled.push(index);
  }

  isAlive(entity: Entity): boolean {
    const index = getIndex(entity);
    const slot = this.slots[index];
    if (!slot) return false;
    return slot.alive && slot.generation === getGeneration(entity);
  }

  getEntityByIndex(index: number): Entity {
    const slot = this.slots[index];
    if (!slot) throw new Error(`EntityPool: no slot at index ${index}`);
    return makeEntity(index, slot.generation);
  }

  get size(): number {
    return this._size;
  }
}
