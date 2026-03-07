import classNames from 'classnames';
import React, { memo } from 'react';

import Board from '@/Board';
import Cell from '@/Cell';
import { ActionTypes } from '@/Constants';
import FaceButton, { FaceTypes } from '@/FaceButton';
import { useMinesweeperState } from '@/Hooks';
import LCDDisplay from '@/LCDDisplay';
import Menus from '@/Menus';
import Timer from '@/Timer';
import type { Dispatch, GameState } from '@/Types';
import { iterateOverBoard } from '@/Utils';
import Window from '@/Window';

import styles from '@/Minesweeper.module.css';
import sharedStyles from '@/Shared.module.css';

const MemoizedCell = memo(Cell);

interface GameStatusProps {
  state: GameState;
  dispatch: Dispatch;
}

function GameStatus({ state, dispatch }: GameStatusProps) {
  const { gameOver, hasWon, mouseDown, bombsToFlag, started, id } = state;
  let type = FaceTypes.SMILE;
  if (gameOver) {
    if (hasWon) {
      type = FaceTypes.KOOL;
    } else {
      type = FaceTypes.DED;
    }
  } else if (mouseDown) {
    type = FaceTypes.OHH;
  }
  return (
    <div className={classNames(styles.gameStatus, sharedStyles.inset)}>
      <LCDDisplay value={bombsToFlag} />
      <FaceButton type={type} onClick={() => dispatch({ type: ActionTypes.RESET_GAME })} />
      <Timer key={id} started={started} gameOver={gameOver} dispatch={dispatch} />
    </div>
  );
}

interface GameBoardProps {
  state: GameState;
  dispatch: Dispatch;
}

function GameBoard({ state, dispatch }: GameBoardProps) {
  const { board, rows, columns, gameOver } = state;
  const cells: React.ReactNode[] = [];
  iterateOverBoard(board, (cell) => {
    cells.push(<MemoizedCell key={`${cell.row}x${cell.col}`} cell={cell} dispatch={dispatch} />);
  });
  return (
    <Board rows={rows} columns={columns} disable={gameOver}>
      {cells}
    </Board>
  );
}

export default function Minesweeper() {
  const { state, dispatch } = useMinesweeperState();
  return (
    <Window title="Minesweeper" renderMenuItems={() => <Menus dispatch={dispatch} />}>
      <div className={sharedStyles.outset}>
        <GameStatus state={state} dispatch={dispatch} />
        <GameBoard state={state} dispatch={dispatch} />
      </div>
    </Window>
  );
}
