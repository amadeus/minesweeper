// @flow strict
import React from 'react';
import classNames from 'classnames';
import {CellStates} from './Constants';
import styles from './Cell.module.css';
import type {CellType, BoardType} from './Types';

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

function isInteractable(cell: CellType): boolean {
  switch (cell.state) {
    case CellStates.HIDDEN:
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

type MouseEventType = SyntheticMouseEvent<HTMLElement>;

type CellProps = {|
  cell: CellType,
  board: BoardType,
  onClick: CellType => void,
  onToggleLock: CellType => void,
  onMouseDown: (MouseEventType, CellType) => void,
  onMouseUp: (MouseEventType, CellType) => void,
|};

const Cell = ({cell, board, onClick, onToggleLock, onMouseDown, onMouseUp}: CellProps) => (
  <div
    className={classNames(styles.container, getStateClass(cell))}
    onContextMenu={
      isFlaggable(cell)
        ? (event: MouseEventType) => {
            event.preventDefault();
            onToggleLock(cell);
          }
        : null
    }
    onClick={isInteractable(cell) ? () => onClick(cell) : null}
    onMouseDown={isInteractable(cell) ? (event: MouseEventType) => onMouseDown(event, cell) : null}
    onMouseUp={isInteractable(cell) ? (event: MouseEventType) => onMouseUp(event, cell) : null}>
    {showTouchingNumber(cell) ? (
      <span className={classNames(styles.touching, getTouchingClass(cell))}>{cell.touching}</span>
    ) : null}
  </div>
);

export default Cell;
