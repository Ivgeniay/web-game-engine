export const VECTOR_AXIS_MARKS = ['x', 'y', 'z'] as const;

export type VectorAxisMark = (typeof VECTOR_AXIS_MARKS)[number];

export interface VectorAxis {
  readonly label: string;
  readonly mark?: VectorAxisMark | undefined;
}

export const VECTOR2_AXES: readonly VectorAxis[] = [
  { label: 'X', mark: 'x' },
  { label: 'Y', mark: 'y' },
];

export const VECTOR3_AXES: readonly VectorAxis[] = [...VECTOR2_AXES, { label: 'Z', mark: 'z' }];

export const VECTOR4_AXES: readonly VectorAxis[] = [...VECTOR3_AXES, { label: 'W' }];

export function replaceComponent(
  vector: readonly number[],
  index: number,
  value: number,
): readonly number[] {
  return vector.map((component, componentIndex) => (componentIndex === index ? value : component));
}
