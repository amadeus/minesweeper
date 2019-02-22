// @flow strict
import React, {useState} from 'react';
import classNames from 'classnames';
import {CellStates} from './Constants';
import styles from './Cell.module.css';
import type {CellType, BoardType, MouseEventType, ActionRefs} from './Types';

function getStateClass(cell: CellType): ?string {
  switch (cell.state) {
    case CellStates.HIDDEN:
      return styles.hidden;
    case CellStates.FLAGGED:
      return styles.flagged;
    case CellStates.FLAGGED_MAYBE:
      return styles.flaggedMaybe;
    case CellStates.BOMB_SELECTED:
      return styles.bombSelected;
    case CellStates.BOMB_FOUND:
      return styles.bombFound;
    case CellStates.BOMB_REVEALED:
      return styles.bombRevealed;
    case CellStates.FLAGGED_MAYBE_REVEALED:
      return styles.bombSelected;
    case CellStates.REVEALED:
      return styles.revealed;
    default:
      return null;
  }
}

function isFlaggable(cell: CellType): boolean {
  switch (cell.state) {
    case CellStates.HIDDEN:
    case CellStates.FLAGGED:
    case CellStates.FLAGGED_MAYBE:
      return true;
    default:
      return false;
  }
}

function isClickable(cell: CellType): boolean {
  switch (cell.state) {
    case CellStates.HIDDEN:
    case CellStates.FLAGGED:
    case CellStates.FLAGGED_MAYBE:
      return true;
    default:
      return false;
  }
}

function showTouchingNumber(cell: CellType): boolean {
  return cell.touching > 0 && cell.state === CellStates.REVEALED;
}

function getTouchingClass(cell: CellType): ?string {
  switch (cell.touching) {
    case 1:
      return styles.value1;
    case 2:
      return styles.value2;
    case 3:
      return styles.value3;
    case 4:
      return styles.value4;
    case 5:
      return styles.value5;
    case 6:
      return styles.value6;
    case 7:
      return styles.value7;
    case 8:
      return styles.value8;
    default:
      return null;
  }
}

type MouseState = {|
  primary: boolean,
  secondary: boolean,
|};

type MouseStateSetter = ((MouseState => MouseState) | MouseState) => void;

const DEFAULT_MOUSE_STATE: MouseState = {primary: false, secondary: false};

function isMouseDown(mouseState: MouseState) {
  return mouseState.primary || mouseState.secondary;
}

function preventDefault(event: SyntheticMouseEvent<HTMLElement>) {
  event.preventDefault();
}

function handleMouseDown({button}: MouseEventType, setMouseState: MouseStateSetter) {
  setMouseState(state => {
    switch (button) {
      case 0: // primary
        return {...state, primary: true};
      case 2: // secondary
        return {...state, secondary: true};
      default:
        return state;
    }
  });
}

function handleMouseUp(
  event: MouseEventType,
  setMouseState: MouseStateSetter,
  cell: CellType,
  {toggleFlagged, revealCell}: ActionRefs
) {
  event.preventDefault();
  switch (event.button) {
    case 0: // primary
      cell.state === CellStates.HIDDEN && revealCell(cell);
      break;
    case 2: // secondary
      isFlaggable(cell) && toggleFlagged(cell);
      break;
    default:
      break;
  }
  setMouseState(() => DEFAULT_MOUSE_STATE);
}

type CellProps = {|
  cell: CellType,
  board: BoardType,
  actions: ActionRefs,
|};

const Cell = ({cell, board, onClick, actions}: CellProps) => {
  const [mouseState, setMouseState] = useState<MouseState>(DEFAULT_MOUSE_STATE);
  return (
    <div
      className={classNames(styles.container, getStateClass(cell), {
        [styles.active]: mouseState.primary && cell.state === CellStates.HIDDEN,
      })}
      onContextMenu={preventDefault}
      onClick={preventDefault}
      onMouseDown={isClickable(cell) ? event => handleMouseDown(event, setMouseState) : null}
      onMouseLeave={isMouseDown(mouseState) ? () => setMouseState(() => DEFAULT_MOUSE_STATE) : null}
      onMouseUp={isMouseDown(mouseState) ? event => handleMouseUp(event, setMouseState, cell, actions) : null}>
      {showTouchingNumber(cell) ? (
        <span className={classNames(styles.touching, getTouchingClass(cell))}>{cell.touching}</span>
      ) : null}
    </div>
  );
};

export default Cell;
