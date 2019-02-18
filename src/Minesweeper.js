// @flow strict

import React, {Component} from 'react';
import classNames from 'classnames';
import lodash from 'lodash';
import Board from './Board';
import Cell from './Cell';
import LCDDisplay from './LCDDisplay';
import FaceButton from './FaceButton';
import {
  getEmptyGrid,
  precomputeSurroundingBombs,
  revealClickedCell,
  checkHasWon,
  setLosingBoard,
  countFlags,
  setWinningBoard,
} from './Utils';
import {CellStates} from './Constants';
import sharedStyles from './Shared.module.css';
import styles from './Minesweeper.module.css';
import type {BoardType, CellType} from './Types';

function isPrimaryButton(event: SyntheticMouseEvent<HTMLElement>): boolean {
  return event.button === 0;
}

type MinesweeperProps = {||};

type MinesweeperState = {|
  board: BoardType,
  gameOver: boolean,
  hasWon: boolean,
  size: number,
  bombs: number,
  bombsToFlag: number,
  mouseDown: boolean,
  started: boolean,
|};

class Minesweeper extends Component<MinesweeperProps, MinesweeperState> {
  state = {
    board: [],
    gameOver: false,
    hasWon: false,
    size: 8,
    bombs: 10,
    bombsToFlag: 10,
    mouseDown: false,
    started: false,
  };

  initializeGame = () => {
    const {size, bombs} = this.state;
    let board = getEmptyGrid(size);
    lodash(board)
      .flatten()
      .sampleSize(bombs)
      .forEach(cell => (cell.bomb = true));
    board = precomputeSurroundingBombs(board);
    this.setState({board, gameOver: false, hasWon: false, mouseDown: false, bombsToFlag: bombs});
  };

  componentDidMount() {
    this.initializeGame();
  }

  handleClick = (cell: CellType) => {
    let {board, gameOver, bombsToFlag} = this.state;
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
    this.setState({board, hasWon, gameOver, bombsToFlag});
  };

  handleLock = (cell: CellType) => {
    const {board, bombs} = this.state;
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
    this.setState({board, bombsToFlag: bombs - bombsFlagged});
  };

  renderGameState() {
    const {gameOver, hasWon, mouseDown, bombsToFlag} = this.state;
    let type = FaceButton.Types.SMILE;
    if (gameOver) {
      if (hasWon) {
        type = FaceButton.Types.KOOL;
      } else {
        type = FaceButton.Types.DED;
      }
    } else if (mouseDown) {
      type = FaceButton.Types.OHH;
    }
    return (
      <div className={classNames(styles.gameStatus, sharedStyles.inset)}>
        <LCDDisplay value={bombsToFlag} />
        <FaceButton type={type} onClick={this.initializeGame} />
        <LCDDisplay value={0} />
      </div>
    );
  }

  renderGame() {
    const {board, size, gameOver} = this.state;
    return (
      <Board size={size} disable={gameOver}>
        {lodash(board)
          .flatten()
          .map(cell => (
            <Cell
              key={`${cell.x}${cell.y}`}
              cell={cell}
              board={board}
              onClick={this.handleClick}
              onToggleLock={this.handleLock}
              onMouseDown={event => void (isPrimaryButton(event) && this.setState({mouseDown: true}))}
              onMouseUp={event => void (isPrimaryButton(event) && this.setState({mouseDown: false}))}
            />
          ))
          .value()}
      </Board>
    );
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={sharedStyles.outset}>
          {this.renderGameState()}
          {this.renderGame()}
        </div>
      </div>
    );
  }
}

export default Minesweeper;
