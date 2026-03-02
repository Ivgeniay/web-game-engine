export type Entity = number;

export class EntityPool {
  private nextId: number = 0;
  private recycled: number[] = [];
  private _size: number = 0;

  create(): Entity {
    this._size++;
    if (this.recycled.length > 0) {
      return this.recycled.pop()!;
    }
    return this.nextId++;
  }

  destroy(entity: Entity): void {
    this._size--;
    this.recycled.push(entity);
  }

  get size(): number {
    return this._size;
  }
}
