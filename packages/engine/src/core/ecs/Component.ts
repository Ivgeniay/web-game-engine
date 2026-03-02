import {
  getComponentFields,
  FieldType,
} from "../../general/decorators/components/field_decorators";

export type ComponentBuffer =
  | Float32Array
  | Int32Array
  | Uint8Array
  | Uint16Array
  | Uint32Array;

export interface ComponentBuffers {
  [field: string]: ComponentBuffer;
}

export type ComponentConstructor = new () => object;

export interface ComponentDefinition {
  constructor: ComponentConstructor;
  buffers: ComponentBuffers;
  bitIndex: number;
}

function createBuffer(type: FieldType, capacity: number): ComponentBuffer {
  switch (type) {
    case FieldType.f32:
      return new Float32Array(capacity);
    case FieldType.i32:
      return new Int32Array(capacity);
    case FieldType.u8:
      return new Uint8Array(capacity);
    case FieldType.u16:
      return new Uint16Array(capacity);
    case FieldType.u32:
      return new Uint32Array(capacity);
  }
}

export function createComponentDefinition(
  constructor: ComponentConstructor,
  capacity: number,
  bitIndex: number,
): ComponentDefinition {
  const fields = getComponentFields(constructor.prototype);

  const buffers: ComponentBuffers = {};
  for (const field of fields) {
    buffers[field.name] = createBuffer(field.type, capacity);
  }

  return { constructor, buffers, bitIndex };
}

export function growComponentBuffers(
  definition: ComponentDefinition,
  newCapacity: number,
): void {
  const fields = getComponentFields(definition.constructor.prototype);

  for (const field of fields) {
    const oldBuffer = definition.buffers[field.name];
    const newBuffer = createBuffer(field.type, newCapacity);
    newBuffer.set(oldBuffer as never);
    definition.buffers[field.name] = newBuffer;
  }
}
