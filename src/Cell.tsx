import * as React from 'react';
import classNames from 'classnames';
import {CellStates, ActionTypes} from './Constants';
import styles from './Cell.module.css';
import type {CellType, MouseEventType, Dispatch} from './Types';

function getStateClass(cell: CellType): string | undefined {
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
      return undefined;
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

function getTouchingClass(cell: CellType): string | undefined {
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
      return undefined;
  }
}

type MouseStateSetter = (arg: ((arg: MouseState) => MouseState) | MouseState) => void;

enum MouseState {
  UP,
  PRIMARY,
  SECONDARY,
}

function isMouseDown(mouseState: MouseState) {
  return mouseState > 0;
}

function preventDefault(event: React.MouseEvent<HTMLElement>) {
  event.preventDefault();
}

function handleMouseDown({button}: MouseEventType, setMouseState: MouseStateSetter, dispatch: Dispatch) {
  switch (button) {
    case 0: // primary
      dispatch({type: ActionTypes.MOUSE_DOWN});
      setMouseState(MouseState.PRIMARY);
      break;
    case 2: // secondary
      setMouseState(MouseState.SECONDARY);
      break;
  }
}

function handleMouseUp(event: MouseEventType, setMouseState: MouseStateSetter, cell: CellType, dispatch: Dispatch) {
  event.preventDefault();
  const {row, col} = cell;
  switch (event.button) {
    case 0: // primary
      if (cell.state === CellStates.HIDDEN) {
        dispatch({type: ActionTypes.REVEAL_CELL, col, row});
      }
      break;
    case 2: // secondary
      if (isFlaggable(cell)) {
        dispatch({type: ActionTypes.TOGGLE_FLAG_CELL, col, row});
      }
      break;
    default:
      break;
  }
  setMouseState(MouseState.UP);
}

interface CellProps {
  cell: CellType;
  dispatch: Dispatch;
}

export default function Cell({cell, dispatch}: CellProps) {
  const [mouseState, setMouseState] = React.useState<MouseState>(MouseState.UP);
  return (
    <div
      className={classNames(styles.container, getStateClass(cell), {
        [styles.active]: mouseState === MouseState.PRIMARY && cell.state === CellStates.HIDDEN,
      })}
      onContextMenu={preventDefault}
      onClick={preventDefault}
      onMouseDown={isClickable(cell) ? (event) => handleMouseDown(event, setMouseState, dispatch) : undefined}
      onMouseLeave={
        isMouseDown(mouseState)
          ? () => {
              dispatch({type: ActionTypes.MOUSE_UP});
              setMouseState(MouseState.UP);
            }
          : undefined
      }
      onMouseUp={isMouseDown(mouseState) ? (event) => handleMouseUp(event, setMouseState, cell, dispatch) : undefined}>
      {showTouchingNumber(cell) ? (
        <span className={classNames(styles.touching, getTouchingClass(cell))}>{cell.touching}</span>
      ) : null}
    </div>
  );
}
