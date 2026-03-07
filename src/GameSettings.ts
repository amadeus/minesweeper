import { DEFAULT_STATE } from '@/Constants';
import type { GameState } from '@/Types';

export interface GameConfig {
  rows: number;
  columns: number;
  bombs: number;
}

export const MIN_CUSTOM_COLUMNS = 9;
export const MAX_CUSTOM_COLUMNS = 30;
export const MIN_CUSTOM_ROWS = 9;
export const MAX_CUSTOM_ROWS = 24;
export const MIN_CUSTOM_BOMBS = 10;
export const MAX_CLASSIC_BOMBS = 668;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getMaximumCustomBombs(rows: number, columns: number): number {
  return Math.min(rows * columns - 1, MAX_CLASSIC_BOMBS);
}

export function normalizeCustomGameConfig({ rows, columns, bombs }: GameConfig): GameConfig {
  const normalizedRows = clamp(rows, MIN_CUSTOM_ROWS, MAX_CUSTOM_ROWS);
  const normalizedColumns = clamp(columns, MIN_CUSTOM_COLUMNS, MAX_CUSTOM_COLUMNS);
  const maxBombs = getMaximumCustomBombs(normalizedRows, normalizedColumns);

  return {
    rows: normalizedRows,
    columns: normalizedColumns,
    bombs: clamp(bombs, MIN_CUSTOM_BOMBS, maxBombs),
  };
}

export function createResetGameState(config: GameConfig): GameState {
  return { ...DEFAULT_STATE, ...config };
}
