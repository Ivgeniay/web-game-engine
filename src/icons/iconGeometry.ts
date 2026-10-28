import { ICON_GRID_PADDING, ICON_GRID_SIZES, ICON_SIZES } from './icon';
import type { IconCircle, IconDefinition, IconFilledRect, IconShape, IconSize } from './icon';

interface Point {
  readonly x: number;
  readonly y: number;
}

interface StrokeBounds {
  readonly min: number;
  readonly max: number;
}

const HALF_STROKE = 0.5;

const PATH_COMMAND_PATTERN = /([A-Za-z])([^A-Za-z]*)/g;

const ARGUMENT_SEPARATOR_PATTERN = /[\s,]+/;

const PATH_ARGUMENT_COUNTS: Readonly<Record<string, number>> = {
  M: 2,
  L: 2,
  H: 1,
  V: 1,
  A: 7,
  Z: 0,
};

const ARC_END_X_INDEX = 5;

const ARC_END_Y_INDEX = 6;

function isHalf(value: number): boolean {
  return Math.abs(value % 1) === HALF_STROKE;
}

function format(point: Point): string {
  return `(${String(point.x)}, ${String(point.y)})`;
}

function strokeBounds(gridSize: number): StrokeBounds {
  return {
    min: ICON_GRID_PADDING + HALF_STROKE,
    max: gridSize - ICON_GRID_PADDING - HALF_STROKE,
  };
}

function isInside(value: number, bounds: StrokeBounds): boolean {
  return value >= bounds.min && value <= bounds.max;
}

function checkPoint(point: Point, bounds: StrokeBounds): string[] {
  return isInside(point.x, bounds) && isInside(point.y, bounds)
    ? []
    : [`point ${format(point)} is outside the working area`];
}

function checkSegment(from: Point, to: Point): string[] {
  if (from.x === to.x && from.y !== to.y && !isHalf(to.x)) {
    return [`vertical line at x=${String(to.x)} is not on a half coordinate`];
  }

  if (from.y === to.y && from.x !== to.x && !isHalf(to.y)) {
    return [`horizontal line at y=${String(to.y)} is not on a half coordinate`];
  }

  return [];
}

function parseArguments(text: string): number[] {
  return text
    .trim()
    .split(ARGUMENT_SEPARATOR_PATTERN)
    .filter((part) => part !== '')
    .map(Number);
}

function argumentAt(values: readonly number[], index: number): number {
  return values[index] ?? Number.NaN;
}

function chunk(values: readonly number[], size: number): number[][] {
  const chunks: number[][] = [];

  for (let start = 0; start < values.length; start += size) {
    chunks.push(values.slice(start, start + size));
  }

  return chunks;
}

function nextPoint(command: string, values: readonly number[], current: Point): Point {
  switch (command) {
    case 'H':
      return { x: argumentAt(values, 0), y: current.y };
    case 'V':
      return { x: current.x, y: argumentAt(values, 0) };
    case 'A':
      return { x: argumentAt(values, ARC_END_X_INDEX), y: argumentAt(values, ARC_END_Y_INDEX) };
    default:
      return { x: argumentAt(values, 0), y: argumentAt(values, 1) };
  }
}

function checkPath(d: string, bounds: StrokeBounds): string[] {
  const commands = [...d.matchAll(PATH_COMMAND_PATTERN)];
  const parsedLength = commands.reduce((length, match) => length + match[0].length, 0);

  if (commands.length === 0 || parsedLength !== d.trimStart().length) {
    return [`path "${d}" cannot be parsed`];
  }

  if (commands[0]?.[1] !== 'M') {
    return [`path "${d}" must start with M`];
  }

  const problems: string[] = [];
  let current: Point = { x: 0, y: 0 };
  let subpathStart = current;

  for (const [, command = '', argumentText = ''] of commands) {
    const argumentCount = PATH_ARGUMENT_COUNTS[command];
    const values = parseArguments(argumentText);

    if (argumentCount === undefined) {
      problems.push(`path command ${command} is not allowed`);
      continue;
    }

    if (command === 'Z') {
      if (values.length > 0) {
        problems.push('path command Z takes no arguments');
      }

      problems.push(...checkSegment(current, subpathStart));
      current = subpathStart;
      continue;
    }

    if (values.length === 0 || values.length % argumentCount !== 0 || values.some(Number.isNaN)) {
      problems.push(`path command ${command} has invalid arguments "${argumentText.trim()}"`);
      continue;
    }

    for (const [index, group] of chunk(values, argumentCount).entries()) {
      const point = nextPoint(command, group, current);
      const startsSubpath = command === 'M' && index === 0;

      problems.push(...checkPoint(point, bounds));

      if (startsSubpath) {
        subpathStart = point;
      } else {
        problems.push(...checkSegment(current, point));
      }

      current = point;
    }
  }

  return problems;
}

function checkCircle(shape: IconCircle, bounds: StrokeBounds): string[] {
  const extremes = [shape.cx - shape.r, shape.cx + shape.r, shape.cy - shape.r, shape.cy + shape.r];
  const problems: string[] = [];

  if (!extremes.every(isHalf)) {
    problems.push(`circle extremes of r=${String(shape.r)} are not on half coordinates`);
  }

  if (!extremes.every((value) => isInside(value, bounds))) {
    problems.push(`circle of r=${String(shape.r)} leaves the working area`);
  }

  return problems;
}

function checkFilledRect(shape: IconFilledRect, gridSize: number): string[] {
  const edges = [shape.x, shape.y, shape.width, shape.height];
  const problems: string[] = [];
  const max = gridSize - ICON_GRID_PADDING;

  if (!edges.every(Number.isInteger) || shape.width <= 0 || shape.height <= 0) {
    problems.push('filled rect must have whole positive coordinates');
  }

  if (
    shape.x < ICON_GRID_PADDING ||
    shape.y < ICON_GRID_PADDING ||
    shape.x + shape.width > max ||
    shape.y + shape.height > max
  ) {
    problems.push('filled rect leaves the working area');
  }

  return problems;
}

function checkShape(shape: IconShape, gridSize: number): string[] {
  const bounds = strokeBounds(gridSize);

  switch (shape.kind) {
    case 'stroke':
      return checkPath(shape.d, bounds);
    case 'circle':
      return checkCircle(shape, bounds);
    case 'fill-rect':
      return checkFilledRect(shape, gridSize);
  }
}

function checkDrawing(definition: IconDefinition, size: IconSize): string[] {
  const drawing = definition[size];

  if (drawing === undefined) {
    return [];
  }

  if (drawing.length === 0) {
    return [`${size}: drawing is empty`];
  }

  return drawing.flatMap((shape, index) =>
    checkShape(shape, ICON_GRID_SIZES[size]).map(
      (problem) => `${size}, shape ${String(index)}: ${problem}`,
    ),
  );
}

export function findIconGeometryProblems(definition: IconDefinition): readonly string[] {
  return ICON_SIZES.flatMap((size) => checkDrawing(definition, size));
}
