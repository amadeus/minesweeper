import classNames from 'classnames';
import { memo, useCallback, useLayoutEffect, useRef, useState } from 'react';

import Board from '@/Board';
import Cell from '@/Cell';
import { ActionTypes, DEFAULT_STATE } from '@/Constants';
import CustomGameDialog from '@/CustomGameDialog';
import FaceButton, { FaceTypes } from '@/FaceButton';
import { useMinesweeperState } from '@/Hooks';
import LCDDisplay from '@/LCDDisplay';
import Menus from '@/Menus';
import Timer from '@/Timer';
import type { Dispatch, GameState, GameConfig } from '@/Types';
import { createResetGameState, iterateOverBoard, normalizeCustomGameConfig } from '@/Utils';
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
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const [customDialogAnchorRect, setCustomDialogAnchorRect] = useState<DOMRect | null>(null);
  const [customGameConfig, setCustomGameConfig] = useState<GameConfig>({
    rows: DEFAULT_STATE.rows,
    columns: DEFAULT_STATE.columns,
    bombs: DEFAULT_STATE.bombs,
  });
  const windowRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const { current: element } = windowRef;
    if (element == null) {
      return;
    }

    const windowRect = element.getBoundingClientRect();
    const centeredX = Math.max(0, (window.innerWidth - windowRect.width) / 2);
    const centeredY = Math.max(0, (window.innerHeight - windowRect.height) / 2);

    element.style.setProperty('--pos-x', `${centeredX}px`);
    element.style.setProperty('--pos-y', `${centeredY}px`);
  }, []);

  const handleCloseCustomDialog = useCallback(() => {
    setIsCustomDialogOpen(false);
  }, []);

  const handleSubmitCustomDialog = useCallback(
    (config: GameConfig) => {
      const normalizedConfig = normalizeCustomGameConfig(config);
      setCustomGameConfig(normalizedConfig);
      setIsCustomDialogOpen(false);
      dispatch({ type: ActionTypes.RESET_GAME, state: createResetGameState(normalizedConfig) });
    },
    [dispatch]
  );

  const renderMenuItems = useCallback(() => {
    return (
      <Menus
        onNewGame={() => {
          dispatch({ type: ActionTypes.RESET_GAME });
        }}
        onSelectPreset={(config: GameConfig) => {
          dispatch({ type: ActionTypes.RESET_GAME, state: createResetGameState(config) });
        }}
        onOpenCustomDialog={() => {
          setCustomGameConfig({ rows: state.rows, columns: state.columns, bombs: state.bombs });
          setCustomDialogAnchorRect(windowRef.current?.getBoundingClientRect() ?? null);
          setIsCustomDialogOpen(true);
        }}
      />
    );
  }, [dispatch, state.bombs, state.columns, state.rows]);

  return (
    <>
      <Window
        ref={windowRef}
        className={classNames({ [styles.windowDimmed]: isCustomDialogOpen })}
        title="Minesweeper"
        renderMenuItems={renderMenuItems}>
        <div className={sharedStyles.outset}>
          <GameStatus state={state} dispatch={dispatch} />
          <GameBoard state={state} dispatch={dispatch} />
        </div>
      </Window>
      {isCustomDialogOpen ? (
        <CustomGameDialog
          anchorRect={customDialogAnchorRect}
          initialConfig={customGameConfig}
          onClose={handleCloseCustomDialog}
          onSubmit={handleSubmitCustomDialog}
        />
      ) : null}
    </>
  );
}
