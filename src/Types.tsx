import type {MouseEvent} from 'react';
import type {CellStates, ActionTypes} from './Constants';

export interface CellType {
  row: number;
  col: number;
  state: CellStates;
  bomb: boolean;
  touching: number;
}

export type BoardType = CellType[][];

export interface GameState {
  id: string;
  board: BoardType;
  gameOver: boolean;
  hasWon: boolean;
  rows: number;
  columns: number;
  bombs: number;
  bombsToFlag: number;
  mouseDown: boolean;
  started: boolean;
}

export type MouseEventType = MouseEvent<HTMLElement>;

export interface ActionResetGame {
  type: ActionTypes.RESET_GAME;
  state?: GameState;
}

export interface ActionRevealCell {
  type: ActionTypes.REVEAL_CELL;
  row: number;
  col: number;
}

export interface ActionToggleFlagCell {
  type: ActionTypes.TOGGLE_FLAG_CELL;
  row: number;
  col: number;
}

export interface ActionSetGameOver {
  type: ActionTypes.SET_GAME_OVER;
}

export interface ActionMouseDown {
  type: ActionTypes.MOUSE_DOWN;
}

export interface ActionMouseUp {
  type: ActionTypes.MOUSE_UP;
}

export type Actions =
  | ActionResetGame
  | ActionRevealCell
  | ActionToggleFlagCell
  | ActionSetGameOver
  | ActionMouseDown
  | ActionMouseUp;

export type Dispatch = (action: Actions) => void;
