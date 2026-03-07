import type { GameState } from '@/Types';

export enum CellStates {
  HIDDEN,
  FLAGGED,
  FLAGGED_MAYBE,
  BOMB_SELECTED,
  BOMB_FOUND,
  BOMB_REVEALED,
  FLAGGED_MAYBE_REVEALED,
  REVEALED,
}

export const CELL_SIZE = 16;

// This defauly state is mostly a type scaffolding that gets filled out in
// Hooks.js in the `gameInitialize` method
export const DEFAULT_STATE: GameState = Object.freeze({
  id: '',
  board: [],
  remainingCells: new Set<string>(),
  gameOver: false,
  hasWon: false,
  rows: 16,
  columns: 16,
  bombs: 40,
  bombsToFlag: 0,
  mouseDown: false,
  started: false,
});

export enum ActionTypes {
  RESET_GAME = 'RESET_GAME',
  REVEAL_CELL = 'REVEAL_CELL',
  SET_GAME_OVER = 'SET_GAME_OVER',
  TOGGLE_FLAG_CELL = 'TOGGLE_FLAG_CELL',
  MOUSE_DOWN = 'MOUSE_DOWN',
  MOUSE_UP = 'MOUSE_UP',
}

export enum MenuGroups {
  GAME = 'GAME',
  HELP = 'HELP',
}

export enum GameItems {
  NEW = 'NEW',
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  EXPERT = 'EXPERT',
  CUSTOM = 'CUSTOM',
}

export enum HelpItems {
  AUTHOR = 'By amadeus',
  SOURCE_CODE = 'Source code',
}

export const MenuItems = Object.freeze({
  [MenuGroups.GAME]: [GameItems.NEW, GameItems.BEGINNER, GameItems.INTERMEDIATE, GameItems.EXPERT, GameItems.CUSTOM],
  [MenuGroups.HELP]: [HelpItems.AUTHOR, HelpItems.SOURCE_CODE],
});

export const AUTHOR_URL = 'https://twitter.com/amadeus';
export const SOURCE_CODE_URL = 'https://github.com/amadeus/minesweeper';

export const MIN_CUSTOM_COLUMNS = 8;
export const MAX_CUSTOM_COLUMNS = 50;
export const MIN_CUSTOM_ROWS = 8;
export const MAX_CUSTOM_ROWS = 50;
export const MIN_CUSTOM_BOMBS = 10;
export const MAX_CLASSIC_BOMBS = 668;
