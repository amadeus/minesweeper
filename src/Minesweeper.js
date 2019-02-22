// @flow strict
import React, {useState, memo} from 'react';
import classNames from 'classnames';
import lodash from 'lodash';
import FaceButton from './FaceButton';
import LCDDisplay from './LCDDisplay';
import Timer from './Timer';
import Board from './Board';
import Cell from './Cell';
import {useMinesweeperState} from './Hooks';
import type {GameState, ActionRefs, StateUpdater} from './Types';
import sharedStyles from './Shared.module.css';
import styles from './Minesweeper.module.css';

const MemoizedCell = memo(Cell);

type GameStatusProps = {|
  state: GameState,
  setState: StateUpdater,
  gameId: number,
  setGameId: any,
|};

const GameStatus = ({state, gameId, setGameId, setState}: GameStatusProps) => {
  const {gameOver, hasWon, mouseDown, bombsToFlag, started} = state;
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
      <FaceButton type={type} onClick={() => setGameId(id => id + 1)} />
      <Timer key={gameId} started={started} gameOver={gameOver} setState={setState} />
    </div>
  );
};

type GameProps = {|
  state: GameState,
  setState: StateUpdater,
  actions: ActionRefs,
|};

const Game = ({state, setState, actions}: GameProps) => {
  const {board, rows, columns, gameOver} = state;
  return (
    <Board rows={rows} columns={columns} disable={gameOver}>
      {lodash(board)
        .flatten()
        .map(cell => <MemoizedCell key={`${cell.x}x${cell.y}`} cell={cell} board={board} actions={actions} />)
        .value()}
    </Board>
  );
};

const Minesweeper = () => {
  const [gameId, setGameId] = useState(0);
  const {state, actions, setState} = useMinesweeperState(gameId);
  return (
    <div className={styles.container}>
      <div className={sharedStyles.outset}>
        <GameStatus state={state} gameId={gameId} setState={setState} setGameId={setGameId} />
        <Game state={state} setState={setState} actions={actions} />
      </div>
    </div>
  );
};

export default Minesweeper;
