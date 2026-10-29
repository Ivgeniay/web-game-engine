import type { MessageRef } from '@/core/i18n/translate';
import type { Color } from './color';
import type { Bounds, Rect } from './geometry';
import type { ValueChangeHandler, ValueChangePhase } from './valueChange';

export const PROPERTY_NUMBER_KINDS = ['integer', 'float'] as const;

export type PropertyNumberKind = (typeof PROPERTY_NUMBER_KINDS)[number];

export const VECTOR_DIMENSIONS = [2, 3, 4] as const;

export type VectorDimensions = (typeof VECTOR_DIMENSIONS)[number];

export interface PropertyAccess<T> {
  read(targetId: string): T;
  write(targetId: string, value: T): void;
}

export interface ItemAccess<I, V> {
  read(item: I): V;
  write(item: I, value: V): I;
}

export interface PropertyCommon<T> extends PropertyAccess<T> {
  readonly id: string;
  readonly label: MessageRef;
  readonly readOnly?: boolean | undefined;
  readonly hidden?: boolean | undefined;
  readonly defaultValue?: T | undefined;
}

export interface PropertyOption<T extends string> {
  readonly value: T;
  readonly label: MessageRef;
}

export interface PropertyType<T> {
  readonly id: string;
  equals(first: T, second: T): boolean;
}

interface NumberSpecBase {
  readonly type: 'number';
  readonly kind?: PropertyNumberKind | undefined;
  readonly step?: number | undefined;
}

interface NumberFieldDisplay {
  readonly slider?: false | undefined;
  readonly min?: number | undefined;
  readonly max?: number | undefined;
}

interface NumberSliderDisplay {
  readonly slider: true;
  readonly min: number;
  readonly max: number;
}

export type NumberSpec = NumberSpecBase & (NumberFieldDisplay | NumberSliderDisplay);

export interface StringSpec {
  readonly type: 'string';
  readonly multiline?: boolean | undefined;
}

export interface BooleanSpec {
  readonly type: 'boolean';
}

export interface VectorSpec {
  readonly type: 'vector';
  readonly dimensions: VectorDimensions;
  readonly kind?: PropertyNumberKind | undefined;
  readonly min?: number | undefined;
  readonly max?: number | undefined;
  readonly step?: number | undefined;
}

export interface ColorSpec {
  readonly type: 'color';
  readonly showAlpha?: boolean | undefined;
}

export interface EnumSpec<T extends string = string> {
  readonly type: 'enum';
  readonly options: readonly PropertyOption<T>[];
}

export interface FlagsSpec<T extends string = string> {
  readonly type: 'flags';
  readonly options: readonly PropertyOption<T>[];
}

export interface RectSpec {
  readonly type: 'rect';
  readonly kind?: PropertyNumberKind | undefined;
}

export interface BoundsSpec {
  readonly type: 'bounds';
  readonly kind?: PropertyNumberKind | undefined;
}

export interface CustomSpec<T = unknown> {
  readonly type: 'custom';
  readonly valueType: PropertyType<T>;
}

export type NumberProperty = PropertyCommon<number> & NumberSpec;
export type StringProperty = PropertyCommon<string> & StringSpec;
export type BooleanProperty = PropertyCommon<boolean> & BooleanSpec;
export type VectorProperty = PropertyCommon<readonly number[]> & VectorSpec;
export type ColorProperty = PropertyCommon<Color> & ColorSpec;
export type EnumProperty<T extends string = string> = PropertyCommon<T> & EnumSpec<T>;
export type FlagsProperty<T extends string = string> = PropertyCommon<readonly T[]> & FlagsSpec<T>;
export type RectProperty = PropertyCommon<Rect> & RectSpec;
export type BoundsProperty = PropertyCommon<Bounds> & BoundsSpec;
export type CustomProperty<T = unknown> = PropertyCommon<T> & CustomSpec<T>;

export type ListItem<I> =
  | (ItemAccess<I, number> & NumberSpec)
  | (ItemAccess<I, string> & StringSpec)
  | (ItemAccess<I, boolean> & BooleanSpec)
  | (ItemAccess<I, readonly number[]> & VectorSpec)
  | (ItemAccess<I, Color> & ColorSpec)
  | (ItemAccess<I, string> & EnumSpec)
  | (ItemAccess<I, readonly string[]> & FlagsSpec)
  | (ItemAccess<I, Rect> & RectSpec)
  | (ItemAccess<I, Bounds> & BoundsSpec)
  | (ItemAccess<I, unknown> & CustomSpec);

export interface ListSpec<I = unknown> {
  readonly type: 'list';
  readonly item: ListItem<I>;
  createItem(): I;
  copyItem?(item: I): I;
  getItemKey?(item: I, index: number): string;
}

export type ListProperty<I = unknown> = PropertyCommon<readonly I[]> & ListSpec<I>;

export type PropertyDescription =
  | NumberProperty
  | StringProperty
  | BooleanProperty
  | VectorProperty
  | ColorProperty
  | EnumProperty
  | FlagsProperty
  | RectProperty
  | BoundsProperty
  | CustomProperty
  | ListProperty;

export type PropertyValueType = PropertyDescription['type'];

export type TargetsChange<T> = (own: T, shown: T) => T;

export type TargetsChangeHandler<T> = (change: TargetsChange<T>, phase: ValueChangePhase) => void;

export interface PropertyEditorProps<T> {
  readonly label: string;
  readonly value: T;
  readonly values: readonly T[];
  readonly mixed: boolean;
  readonly readOnly: boolean;
  readonly onValueChange: ValueChangeHandler<T>;
  readonly onTargetsChange: TargetsChangeHandler<T>;
}
