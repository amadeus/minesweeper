// @flow strict
import React, {useState, memo} from 'react';
import classNames from 'classnames';
import lodash from 'lodash';
import FaceButton from './FaceButton';
import LCDDisplay from './LCDDisplay';
import Board from './Board';
import Cell from './Cell';
import {useMinesweeperState, type GameState, type HandlerRefs, type StateUpdater} from './Hooks';
import sharedStyles from './Shared.module.css';
import styles from './Minesweeper.module.css';

const MemoizedCell = memo(Cell);

type GameStatusProps = {|
  state: GameState,
  gameId: number,
  setGameId: any,
|};

const GameStatus = ({state, gameId, setGameId}: GameStatusProps) => {
  const {gameOver, hasWon, mouseDown, bombsToFlag} = state;
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
      <LCDDisplay value={0} />
    </div>
  );
};

type GameProps = {|
  state: GameState,
  setState: StateUpdater,
  handlers: HandlerRefs,
|};

const Game = ({state, setState, handlers}: GameProps) => {
  const {board, rows, columns, gameOver} = state;
  const {handleClick, handleLock, handleMouseDown, handleMouseUp} = handlers;
  return (
    <Board rows={rows} columns={columns} disable={gameOver}>
      {lodash(board)
        .flatten()
        .map(cell => (
          <MemoizedCell
            key={`${cell.x}${cell.y}`}
            cell={cell}
            board={board}
            onClick={handleClick}
            onToggleLock={handleLock}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          />
        ))
        .value()}
    </Board>
  );
};

const Minesweeper = () => {
  const [gameId, setGameId] = useState(0);
  const {state, handlers, setState} = useMinesweeperState(gameId);
  return (
    <div className={styles.container}>
      <div className={sharedStyles.outset}>
        <GameStatus state={state} gameId={gameId} setGameId={setGameId} />
        <Game state={state} setState={setState} handlers={handlers} />
      </div>
    </div>
  );
};

export default Minesweeper;
