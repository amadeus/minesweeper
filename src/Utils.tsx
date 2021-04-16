import type {CellType, BoardType} from './Types';
import lodash from 'lodash';
import {CellStates} from './Constants';

// This array is used to `forEach` around a cell to check its siblings
const SURROUNDING_CELLS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

function mapEachCell(board: BoardType, callback: (cell: CellType) => CellType): BoardType {
  return board.map((row) => row.map(callback));
}

function getSurroundingBombs({x, y, bomb, state}: CellType, board: BoardType): number {
  if (bomb) {
    return 0;
  }

  return SURROUNDING_CELLS.reduce<number>((acc, [_y, _x]) => {
    const row = board[y + _y];
    if (row == null) {
      return acc;
    }
    const cell = row[x + _x];
    if (cell == null) {
      return acc;
    }
    return cell.bomb ? acc + 1 : acc;
  }, 0);
}

// Generates an empty cell...
function generateEmptyCell(x: number, y: number): CellType {
  return {
    x,
    y,
    state: CellStates.HIDDEN,
    bomb: false,
    touching: 0,
  };
}

// Generates an empty board...
export function getEmptyGrid(rows: number, columns: number): BoardType {
  return new Array(rows).fill([]).map((_: [], y: number) => {
    return new Array(columns).fill(null).map((_: null, x: number) => generateEmptyCell(x, y));
  });
}

// Calcualte `touching` prop on all cells
export function precomputeSurroundingBombs(board: BoardType): BoardType {
  return mapEachCell(board, (cell) => ({...cell, touching: getSurroundingBombs(cell, board)}));
}

// Reveal the clicked cell. If the cell is empty (meaning it is not touching a
// bomb), iterate through surrounding cells and reveal up to all touching cells
export function revealClickedCell(cell: CellType, board: BoardType): BoardType {
  const toCheck: Set<CellType> = new Set([cell]);
  const toReveal: Set<CellType> = new Set([cell]);
  const checked: Set<CellType> = new Set();
  const checkCell = (cell: CellType) => {
    checked.add(cell);
    SURROUNDING_CELLS.forEach(([y, x]) => {
      const row = board[cell.y + y];
      if (row == null) {
        return;
      }
      const newCell = row[cell.x + x];
      if (newCell == null || newCell.bomb) {
        return;
      }
      if (newCell.touching === 0 && !checked.has(newCell)) {
        toCheck.add(newCell);
      }
      toReveal.add(newCell);
    });
  };

  while (toCheck.size > 0 && cell.touching === 0) {
    // It's faster to use `Array.from` vs `new Set` to `dupe` this data
    // https://jsperf.com/array-from-vs-new-set/1
    const cells = Array.from(toCheck);
    toCheck.clear();
    cells.forEach(checkCell);
  }

  toReveal.forEach((cell) => {
    board[cell.y][cell.x] = {...cell, state: CellStates.REVEALED};
  });

  return board;
}

// Game has been won if only the bombs are hidden
export function checkHasWon(board: BoardType): boolean {
  return !lodash(board)
    .flatten()
    .filter((cell: CellType) => cell.state !== CellStates.REVEALED)
    .some((cell: CellType) => !cell.bomb);
}

// Reveal all bombs and highlight the one clicked
export function setLosingBoard(losingCell: CellType | null, board: BoardType): BoardType {
  return mapEachCell(board, (cell) => {
    if (cell.bomb) {
      if (cell === losingCell) {
        return {...cell, state: CellStates.BOMB_SELECTED};
      }
      return {...cell, state: CellStates.BOMB_REVEALED};
    }
    return cell;
  });
}

// This function is used on an `assumed` winning board to reveal all bumbs
export function setWinningBoard(board: BoardType): BoardType {
  return mapEachCell(board, (cell) => {
    if (cell.bomb) {
      return {...cell, state: CellStates.BOMB_FOUND};
    }
    return {...cell, state: CellStates.REVEALED};
  });
}

// Count the number of flags on a board...
export function countFlags(board: BoardType): number {
  return lodash(board)
    .flatten()
    .filter((cell: CellType) => cell.state === CellStates.FLAGGED)
    .value().length;
}
