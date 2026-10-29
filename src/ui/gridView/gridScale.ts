export const GRID_CELL_SIZE_MIN = 16;
export const GRID_CELL_SIZE_MAX = 128;
export const GRID_CELL_SIZE_DEFAULT = 64;

export function isListScale(cellSize: number): boolean {
  return cellSize <= GRID_CELL_SIZE_MIN;
}
