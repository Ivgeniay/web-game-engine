import "reflect-metadata";

const COMPONENT_FIELDS_KEY = Symbol("component_fields");

export const enum FieldType {
  f32 = "f32",
  i32 = "i32",
  u8 = "u8",
  u16 = "u16",
  u32 = "u32",
}

export interface FieldMetadata {
  name: string;
  type: FieldType;
}

function createFieldDecorator(type: FieldType) {
  return function (target: object, propertyKey: string) {
    const fields: FieldMetadata[] =
      Reflect.getMetadata(COMPONENT_FIELDS_KEY, target) ?? [];
    fields.push({ name: propertyKey, type });
    Reflect.defineMetadata(COMPONENT_FIELDS_KEY, fields, target);
  };
}

export function getComponentFields(target: object): FieldMetadata[] {
  return Reflect.getMetadata(COMPONENT_FIELDS_KEY, target) ?? [];
}

export const f32 = createFieldDecorator(FieldType.f32);
export const i32 = createFieldDecorator(FieldType.i32);
export const u8 = createFieldDecorator(FieldType.u8);
export const u16 = createFieldDecorator(FieldType.u16);
export const u32 = createFieldDecorator(FieldType.u32);
