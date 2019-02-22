// @flow strict

import typeof {CellStates} from './Constants';

export type CellType = {|
  x: number,
  y: number,
  state: $Values<CellStates>,
  bomb: boolean,
  touching: number,
|};

export type BoardType = Array<Array<CellType>>;

export type GameState = {|
  board: BoardType,
  gameOver: boolean,
  hasWon: boolean,
  rows: number,
  columns: number,
  bombs: number,
  bombsToFlag: number,
  mouseDown: boolean,
  started: boolean,
|};

export type MouseEventType = SyntheticMouseEvent<HTMLElement>;

export type StateUpdater = ((GameState => GameState) | GameState) => void;

export type StateRefType = {
  current: {|
    state: GameState,
    setState: StateUpdater,
  |},
};

export type ActionRefs = {|
  toggleFlagged: CellType => void,
  revealCell: CellType => void,
|};
