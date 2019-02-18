// @flow strict

import keyMirror from 'keymirror';

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
