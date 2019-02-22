// @flow strict
import {useState, useRef, useEffect} from 'react';
import lodash from 'lodash';
import {
  getEmptyGrid,
  precomputeSurroundingBombs,
  countFlags,
  setLosingBoard,
  revealClickedCell,
  checkHasWon,
  setWinningBoard,
} from './Utils';
import {CellStates, DEFAULT_STATE} from './Constants';
import type {CellType, GameState, ActionRefs, StateRefType, StateUpdater} from './Types';

const handleLock = (cell: CellType, {current: {state, setState}}: StateRefType) => {
  const {board, bombs, started} = state;
  if (!started) {
    return;
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
  setState(s => ({...s, board, bombsToFlag: bombs - bombsFlagged}));
};

const handleClick = (cell: CellType, {current: {state, setState}}: StateRefType) => {
  let {board, gameOver, bombsToFlag} = state;
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
  setState(s => ({...s, board, hasWon, gameOver, bombsToFlag, started: true}));
};

type MinesweeperState = {|
  state: GameState,
  setState: StateUpdater,
  actions: ActionRefs,
|};

export function useMinesweeperState(gameId: number, initialState?: GameState = DEFAULT_STATE): MinesweeperState {
  // State
  const [state, setState] = useState<GameState>(initialState);
  const stateRef = useRef({state, setState});
  stateRef.current = {state, setState};

  // Initialize board for every new gameId
  useEffect(() => {
    const {rows, columns, bombs} = state;
    let board = getEmptyGrid(rows, columns);
    lodash(board)
      .flatten()
      .sampleSize(bombs)
      .forEach(cell => (cell.bomb = true));
    board = precomputeSurroundingBombs(board);
    stateRef.current.state = {...DEFAULT_STATE, board};
    setState(stateRef.current.state);
  }, [gameId]);

  // Setup actions
  const actions = useRef<ActionRefs>({
    toggleFlagged: (cell: CellType) => handleLock(cell, stateRef),
    revealCell: (cell: CellType) => handleClick(cell, stateRef),
  });

  return {state, setState, actions: actions.current};
}
