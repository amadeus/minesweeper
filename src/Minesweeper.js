// @flow strict
import React, {memo} from 'react';
import classNames from 'classnames';
import lodash from 'lodash';
import FaceButton from './FaceButton';
import LCDDisplay from './LCDDisplay';
import Timer from './Timer';
import Board from './Board';
import Cell from './Cell';
import Window from './Window';
import Menus from './Menus';
import {useMinesweeperState} from './Hooks';
import {ActionTypes} from './Constants';
import type {GameState, Dispatch} from './Types';
import sharedStyles from './Shared.module.css';
import styles from './Minesweeper.module.css';

const MemoizedCell = memo(Cell);

type GameStatusProps = {|
  state: GameState,
  dispatch: Dispatch,
|};

const GameStatus = ({state, dispatch}: GameStatusProps) => {
  const {gameOver, hasWon, mouseDown, bombsToFlag, started, id} = state;
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
      <FaceButton type={type} onClick={() => dispatch({type: ActionTypes.RESET_GAME})} />
      <Timer key={id} started={started} gameOver={gameOver} dispatch={dispatch} />
    </div>
  );
};

type GameBoardProps = {|
  state: GameState,
  dispatch: Dispatch,
|};

const GameBoard = ({state, dispatch}: GameBoardProps) => {
  const {board, rows, columns, gameOver} = state;
  return (
    <Board rows={rows} columns={columns} disable={gameOver}>
      {lodash(board)
        .flatten()
        .map(cell => <MemoizedCell key={`${cell.x}x${cell.y}`} cell={cell} board={board} dispatch={dispatch} />)
        .value()}
    </Board>
  );
};

const Minesweeper = () => {
  const {state, dispatch} = useMinesweeperState();
  return (
    <Window title="Minesweeper" renderMenuItems={() => <Menus dispatch={dispatch} />}>
      <div className={sharedStyles.outset}>
        <GameStatus state={state} dispatch={dispatch} />
        <GameBoard state={state} dispatch={dispatch} />
      </div>
    </Window>
  );
};

export default Minesweeper;
