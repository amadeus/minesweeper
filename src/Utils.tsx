import type {CellType, BoardType} from './Types';
import {CellStates} from './Constants';

type CellIterator = (cell: CellType, row: number, column: number) => boolean | undefined | void;

export function iterateOverBoard(board: BoardType, callback: CellIterator): CellType | undefined {
  for (let r = 0; r < board.length; r++) {
    const row = board[r];
    if (row == null) throw new Error(`iterateOverBoard: row: ${r} doesn't exist`);
    for (let c = 0; c < row.length; c++) {
      const cell = row[c];
      if (cell == null) throw new Error(`iterateOverBoard: col on row: ${r} doesn't exist`);
      if (callback(cell, r, c) === true) {
        return cell;
      }
    }
  }
  return undefined;
}

export function getRandomInt(high: number, low: number = 0): number {
  return Math.floor(Math.random() * (high - low) + low);
}

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

function getSurroundingBombs({row, col, bomb}: CellType, board: BoardType): number {
  if (bomb) {
    return 0;
  }

  return SURROUNDING_CELLS.reduce<number>((acc, [rowOffset, colOffset]) => {
    const _row = board[row + rowOffset];
    if (_row == null) {
      return acc;
    }
    const cell = _row[col + colOffset];
    if (cell == null) {
      return acc;
    }
    return cell.bomb ? acc + 1 : acc;
  }, 0);
}

// Generates an empty cell...
function generateEmptyCell(row: number, col: number): CellType {
  return {
    row,
    col,
    state: CellStates.HIDDEN,
    bomb: false,
    touching: 0,
  };
}

// Generates an empty board...
export function getEmptyGrid(rows: number, columns: number): BoardType {
  return new Array(rows).fill([]).map((_: [], row: number) => {
    return new Array(columns).fill(null).map((_: null, col: number) => generateEmptyCell(row, col));
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
    SURROUNDING_CELLS.forEach(([rowOffset, colOffset]) => {
      const row = board[cell.row + rowOffset];
      if (row == null) {
        return;
      }
      const newCell = row[cell.col + colOffset];
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
    for (const cell of cells) {
      checkCell(cell);
    }
  }

  for (const cell of toReveal) {
    board[cell.row][cell.col] = {...cell, state: CellStates.REVEALED};
  }

  return board;
}

// We have won the game if all unrevealed cells are bombs
export function checkHasWon(board: BoardType): boolean {
  return iterateOverBoard(board, (cell) => cell.state !== CellStates.REVEALED && !cell.bomb) == null;
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
  let flagCount = 0;
  iterateOverBoard(board, (cell) => {
    if (cell.state === CellStates.FLAGGED) {
      flagCount++;
    }
    return false;
  });
  return flagCount;
}

export function getCellFromCords(row: number, col: number, board: BoardType): CellType | undefined {
  return board[row][col];
}
