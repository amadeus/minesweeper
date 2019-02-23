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

// This defauly state is mostly a type scaffolding that gets filled out in
// Hooks.js in the `gameInitialize` method
export const DEFAULT_STATE: GameState = Object.freeze({
  id: '',
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

export const ActionTypes = Object.freeze(
  keyMirror({
    RESET_GAME: null,
    REVEAL_CELL: null,
    SET_GAME_OVER: null,
    TOGGLE_FLAG_CELL: null,
  })
);

export const MenuItems = Object.freeze({
  Game: ['New', 'Beginner', 'Intermediate', 'Expert', 'Custom'],
  Help: ['Nope'],
});
