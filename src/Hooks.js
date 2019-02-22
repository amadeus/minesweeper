// @flow strict
import {useReducer} from 'react';
import lodash from 'lodash';
import uuid from 'uuid/v4';
import {
  getEmptyGrid,
  precomputeSurroundingBombs,
  countFlags,
  setLosingBoard,
  revealClickedCell,
  checkHasWon,
  setWinningBoard,
} from './Utils';
import {CellStates, DEFAULT_STATE, ActionTypes} from './Constants';
import type {GameState, Actions, Dispatch} from './Types';

function gameInitialize(state: GameState): GameState {
  const {rows, columns, bombs} = state;
  let board = getEmptyGrid(rows, columns);
  lodash(board)
    .flatten()
    .sampleSize(bombs)
    .forEach(cell => (cell.bomb = true));
  board = precomputeSurroundingBombs(board);
  return {...state, board, bombsToFlag: bombs, id: uuid()};
}

function reducer(state: GameState, action: Actions): GameState {
  switch (action.type) {
    case ActionTypes.RESET_GAME:
      return gameInitialize(action.state);
    case ActionTypes.REVEAL_CELL: {
      let {board, gameOver, bombsToFlag} = state;
      const {cell} = action;
      let hasWon = false;
      if (cell.bomb) {
        board = setLosingBoard(cell, board);
        gameOver = true;
        bombsToFlag = 0;
      } else {
        board = revealClickedCell(cell, board);
        hasWon = checkHasWon(board);
        if (hasWon) {
          gameOver = true;
          board = setWinningBoard(board);
          bombsToFlag = 0;
        }
      }
      return {...state, board, hasWon, gameOver, bombsToFlag, started: true};
    }
    case ActionTypes.TOGGLE_FLAG_CELL: {
      const {board, bombs, started} = state;
      const {cell} = action;
      if (!started) {
        return state;
      }
      let _cell;
      if (cell.state === CellStates.HIDDEN) {
        _cell = {...cell, state: CellStates.FLAGGED};
      } else if (cell.state === CellStates.FLAGGED) {
        _cell = {...cell, state: CellStates.FLAGGED_MAYBE};
      } else {
        _cell = {...cell, state: CellStates.HIDDEN};
      }
      board[_cell.y][_cell.x] = _cell;
      const bombsFlagged = countFlags(board);
      return {...state, board, bombsToFlag: bombs - bombsFlagged};
    }
    case ActionTypes.SET_GAME_OVER: {
      let {board} = state;
      board = setLosingBoard(null, board);
      return {...state, board, gameOver: true, hasWon: false};
    }
    default:
      return state;
  }
}

type MinesweeperState = {|
  state: GameState,
  dispatch: Dispatch,
|};

export function useMinesweeperState(initialState?: GameState = DEFAULT_STATE): MinesweeperState {
  const [state, dispatch] = useReducer<GameState, Actions, typeof DEFAULT_STATE>(reducer, initialState, gameInitialize);
  return {state, dispatch};
}
