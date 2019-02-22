// @flow
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
import {CellStates} from './Constants';
import type {CellType, BoardType} from './Types';

type MouseEventType = SyntheticMouseEvent<HTMLElement>;

export type GameState = {|
  board: BoardType,
  gameOver: boolean,
  hasWon: boolean,
  size: number,
  bombs: number,
  bombsToFlag: number,
  mouseDown: boolean,
  started: boolean,
|};

export type StateUpdater = ((GameState => GameState) | GameState) => void;

type StateRefType = {
  current: {|
    state: GameState,
    setState: StateUpdater,
  |},
};

export type HandlerRefs = {|
  handleLock: CellType => void,
  handleClick: CellType => void,
  handleMouseDown: (MouseEventType, CellType) => void,
  handleMouseUp: (MouseEventType, CellType) => void,
|};

const DEFAULT_STATE: GameState = {
  board: [],
  gameOver: false,
  hasWon: false,
  size: 8,
  bombs: 10,
  bombsToFlag: 10,
  mouseDown: false,
  started: false,
};

const handleLock = (cell: CellType, {current: {state, setState}}: StateRefType) => {
  const {board, bombs} = state;
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
  setState({...state, board, bombsToFlag: bombs - bombsFlagged});
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
  setState({...state, board, hasWon, gameOver, bombsToFlag});
};

function isRightClick(event: SyntheticMouseEvent<HTMLElement>): boolean {
  return event.button !== 2;
}

const handleMouseDown = (event: MouseEventType, cell: CellType, {current: {state, setState}}: StateRefType) => {
  isRightClick(event) && setState({...state, mouseDown: true});
};

const handleMouseUp = (event: MouseEventType, cell: CellType, {current: {state, setState}}: StateRefType) => {
  isRightClick(event) && setState({...state, mouseDown: false});
};

type MinesweeperState = {|
  state: GameState,
  setState: StateUpdater,
  handlers: HandlerRefs,
|};

export function useMinesweeperState(gameId: number, initialState?: GameState = DEFAULT_STATE): MinesweeperState {
  // State
  const [state, setState] = useState<GameState>(initialState);
  const stateRef = useRef({state, setState});
  stateRef.current = {state, setState};

  // Initialize board for every new gameId
  useEffect(() => {
    const {size, bombs} = state;
    let board = getEmptyGrid(size);
    lodash(board)
      .flatten()
      .sampleSize(bombs)
      .forEach(cell => (cell.bomb = true));
    board = precomputeSurroundingBombs(board);
    stateRef.current.state = {...DEFAULT_STATE, board};
    setState(stateRef.current.state);
  }, [gameId]);

  // Setup handlers
  const handlers = useRef<HandlerRefs>({
    handleLock: (cell: CellType) => handleLock(cell, stateRef),
    handleClick: (cell: CellType) => handleClick(cell, stateRef),
    handleMouseDown: (event: MouseEventType, cell: CellType) => handleMouseDown(event, cell, stateRef),
    handleMouseUp: (event: MouseEventType, cell: CellType) => handleMouseUp(event, cell, stateRef),
  });

  return {state, setState, handlers: handlers.current};
}
