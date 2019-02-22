// @flow strict

import keyMirror from 'keymirror';
import type {GameState} from './Types';

export const CellStates = Object.freeze(
  keyMirror({
    HIDDEN: null,
    FLAGGED: null,
    FLAGGED_MAYBE: null,
    BOMB_SELECTED: null,
    BOMB_FOUND: null,
    BOMB_REVEALED: null,
    FLAGGED_MAYBE_REVEALED: null,
    REVEALED: null,
  })
);

export const CELL_SIZE = 16;

export const DEFAULT_STATE: GameState = Object.freeze({
  board: [],
  gameOver: false,
  hasWon: false,
  rows: 14,
  columns: 20,
  bombs: 43,
  bombsToFlag: 10,
  mouseDown: false,
  started: false,
});
