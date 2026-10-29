import type {
  BooleanProperty,
  BoundsProperty,
  ColorProperty,
  CustomProperty,
  EnumProperty,
  FlagsProperty,
  ListItem,
  ListProperty,
  NumberProperty,
  PropertyCommon,
  PropertyOption,
  PropertyType,
  RectProperty,
  ReferenceProperty,
  StringProperty,
  VectorProperty,
} from '@/contracts/property';
import { samePropertyValue } from './propertyValue';

type WithoutType<P> = P extends unknown ? Omit<P, 'type'> : never;

export interface EnumPropertyInput<T extends string> extends PropertyCommon<T> {
  readonly options: readonly PropertyOption<T>[];
}

export interface FlagsPropertyInput<T extends string> extends PropertyCommon<readonly T[]> {
  readonly options: readonly PropertyOption<T>[];
}

export interface CustomPropertyInput<T> extends PropertyCommon<T> {
  readonly valueType: PropertyType<T>;
}

export interface ListPropertyInput<I> extends PropertyCommon<readonly I[]> {
  readonly item: ListItem<I>;
  createItem(): I;
  copyItem?(item: I): I;
  getItemKey?(item: I, index: number): string;
}

export interface PropertyTypeInput<T> {
  readonly id: string;
  readonly equals?: ((first: T, second: T) => boolean) | undefined;
}

export function definePropertyType<T>({
  id,
  equals = samePropertyValue,
}: PropertyTypeInput<T>): PropertyType<T> {
  return { id, equals };
}

export function numberProperty(input: WithoutType<NumberProperty>): NumberProperty {
  return { ...input, type: 'number' };
}

export function stringProperty(input: WithoutType<StringProperty>): StringProperty {
  return { ...input, type: 'string' };
}

export function booleanProperty(input: WithoutType<BooleanProperty>): BooleanProperty {
  return { ...input, type: 'boolean' };
}

export function vectorProperty(input: WithoutType<VectorProperty>): VectorProperty {
  return { ...input, type: 'vector' };
}

export function colorProperty(input: WithoutType<ColorProperty>): ColorProperty {
  return { ...input, type: 'color' };
}

export function enumProperty<T extends string>(
  input: EnumPropertyInput<T>,
): NoInfer<EnumProperty<T>> {
  return { ...input, type: 'enum' };
}

export function flagsProperty<T extends string>(
  input: FlagsPropertyInput<T>,
): NoInfer<FlagsProperty<T>> {
  return { ...input, type: 'flags' };
}

export function rectProperty(input: WithoutType<RectProperty>): RectProperty {
  return { ...input, type: 'rect' };
}

export function boundsProperty(input: WithoutType<BoundsProperty>): BoundsProperty {
  return { ...input, type: 'bounds' };
}

export function referenceProperty(input: WithoutType<ReferenceProperty>): ReferenceProperty {
  return { ...input, type: 'reference' };
}

export function customProperty<T>(input: CustomPropertyInput<T>): NoInfer<CustomProperty<T>> {
  return { ...input, type: 'custom' };
}

export function listProperty<I>(input: ListPropertyInput<I>): NoInfer<ListProperty<I>> {
  return { ...input, type: 'list' };
}
