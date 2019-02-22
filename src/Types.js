// @flow strict
import typeof {CellStates, ActionTypes} from './Constants';

export type CellType = {|
  x: number,
  y: number,
  state: $Values<CellStates>,
  bomb: boolean,
  touching: number,
|};

export type BoardType = Array<Array<CellType>>;

export type GameState = {|
  id: string,
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

export type ActionResetGame = {|
  type: $PropertyType<ActionTypes, 'RESET_GAME'>,
  state: GameState,
|};

export type ActionRevealCell = {|
  type: $PropertyType<ActionTypes, 'REVEAL_CELL'>,
  cell: CellType,
|};

export type ActionToggleFlagCell = {|
  type: $PropertyType<ActionTypes, 'TOGGLE_FLAG_CELL'>,
  cell: CellType,
|};

export type ActionSetGameOver = {|
  type: $PropertyType<ActionTypes, 'SET_GAME_OVER'>,
|};

export type Actions = ActionResetGame | ActionRevealCell | ActionToggleFlagCell | ActionSetGameOver;

export type Dispatch = Actions => void;
