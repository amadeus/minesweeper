import { useReducer } from 'react';

import { ActionTypes, CellStates, DEFAULT_STATE } from '@/Constants';
import type { Actions, Dispatch, GameState } from '@/Types';
import {
  getEmptyGrid,
  countFlags,
  setLosingBoard,
  revealClickedCell,
  checkHasWon,
  setWinningBoard,
  getCellFromCords,
  populateBoardWithBombs,
} from '@/Utils';

let gameCounter = -1;

function gameInitialize(state: GameState = DEFAULT_STATE): GameState {
  const { rows, columns, bombs: bombsToFlag } = state;
  const board = getEmptyGrid(rows, columns);
  return { ...state, board, bombsToFlag, id: `${++gameCounter}`, started: false, hasWon: false, gameOver: false };
}

function reducer(state: GameState, action: Actions): GameState {
  switch (action.type) {
    case ActionTypes.RESET_GAME:
      return gameInitialize(action.state || state);
    case ActionTypes.REVEAL_CELL: {
      let { board, gameOver, bombsToFlag, started, bombs } = state;
      if (!started) {
        board = populateBoardWithBombs(board, bombs, action.row, action.col);
      }
      const cell = getCellFromCords(action.row, action.col, board);
      if (cell == null) return state;
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
      return {
        ...state,
        board,
        hasWon,
        gameOver,
        bombsToFlag,
        started: true,
        mouseDown: false,
      };
    }
    case ActionTypes.TOGGLE_FLAG_CELL: {
      const { board, bombs, started } = state;
      const cell = getCellFromCords(action.row, action.col, board);
      if (cell == null) return state;
      if (!started) {
        return state;
      }
      let _cell;
      if (cell.state === CellStates.HIDDEN) {
        _cell = { ...cell, state: CellStates.FLAGGED };
      } else if (cell.state === CellStates.FLAGGED) {
        _cell = { ...cell, state: CellStates.FLAGGED_MAYBE };
      } else {
        _cell = { ...cell, state: CellStates.HIDDEN };
      }
      board[_cell.row][_cell.col] = _cell;
      const bombsFlagged = countFlags(board);
      return { ...state, board, bombsToFlag: bombs - bombsFlagged };
    }
    case ActionTypes.SET_GAME_OVER: {
      let { board } = state;
      board = setLosingBoard(null, board);
      return { ...state, board, gameOver: true, hasWon: false };
    }
    case ActionTypes.MOUSE_DOWN: {
      return { ...state, mouseDown: true };
    }
    case ActionTypes.MOUSE_UP: {
      return { ...state, mouseDown: false };
    }
    default:
      return state;
  }
}

interface MinesweeperState {
  state: GameState;
  dispatch: Dispatch;
}

export function useMinesweeperState(initialState: GameState = DEFAULT_STATE): MinesweeperState {
  const [state, dispatch] = useReducer(reducer, initialState, gameInitialize);
  return { state, dispatch };
}
