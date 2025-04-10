import {useReducer} from 'react';
import {
  getEmptyGrid,
  precomputeSurroundingBombs,
  countFlags,
  setLosingBoard,
  revealClickedCell,
  checkHasWon,
  setWinningBoard,
  getCellFromCords,
  iterateOverBoard,
  getRandomInt,
} from './Utils';
import {CellStates, DEFAULT_STATE, ActionTypes} from './Constants';
import type {GameState, Actions, Dispatch, CellType} from './Types';

let gameCounter = -1;

function gameInitialize(state: GameState = DEFAULT_STATE): GameState {
  const {rows, columns, bombs: bombsToFlag} = state;
  let {bombs} = state;
  let board = getEmptyGrid(rows, columns);
  const sampleCells: CellType[] = [];
  iterateOverBoard(board, (cell, row, col) => {
    // NOTE: Since the beginning of the game is always a crapshoot and
    // corners tend to be a good spot to start from, lets ensure there is
    // never a bomb in a corner
    if (
      !(
        (col === 0 && row === 0) ||
        (col === 0 && row === rows - 1) ||
        (col === columns - 1 && row === rows - 1) ||
        (col === columns - 1 && row === 0)
      )
    ) {
      sampleCells.push(cell);
    }
  });
  while (bombs > 0 && sampleCells.length > 0) {
    const cell = sampleCells.splice(getRandomInt(sampleCells.length), 1)[0];
    if (cell == null) {
      throw new Error('gameInitialize: Cell does not exist');
    }
    cell.bomb = true;
    bombs--;
  }
  board = precomputeSurroundingBombs(board);
  return {...state, board, bombsToFlag, id: `${++gameCounter}`, started: false, hasWon: false, gameOver: false};
}

function reducer(state: GameState, action: Actions): GameState {
  switch (action.type) {
    case ActionTypes.RESET_GAME:
      return gameInitialize(action.state || state);
    case ActionTypes.REVEAL_CELL: {
      let {board, gameOver, bombsToFlag} = state;
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
      return {...state, board, hasWon, gameOver, bombsToFlag, started: true, mouseDown: false};
    }
    case ActionTypes.TOGGLE_FLAG_CELL: {
      const {board, bombs, started} = state;
      const cell = getCellFromCords(action.row, action.col, board);
      if (cell == null) return state;
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
      board[_cell.row][_cell.col] = _cell;
      const bombsFlagged = countFlags(board);
      return {...state, board, bombsToFlag: bombs - bombsFlagged};
    }
    case ActionTypes.SET_GAME_OVER: {
      let {board} = state;
      board = setLosingBoard(null, board);
      return {...state, board, gameOver: true, hasWon: false};
    }
    case ActionTypes.MOUSE_DOWN: {
      return {...state, mouseDown: true};
    }
    case ActionTypes.MOUSE_UP: {
      return {...state, mouseDown: false};
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
  return {state, dispatch};
}
