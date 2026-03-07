import classNames from 'classnames';
import React, { memo } from 'react';

import Board from '@/Board';
import Cell from '@/Cell';
import CustomGameDialog from '@/CustomGameDialog';
import { ActionTypes, DEFAULT_STATE } from '@/Constants';
import FaceButton, { FaceTypes } from '@/FaceButton';
import { createResetGameState, normalizeCustomGameConfig } from '@/GameSettings';
import type { GameConfig } from '@/GameSettings';
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
  const [isCustomDialogOpen, setIsCustomDialogOpen] = React.useState(false);
  const [customGameConfig, setCustomGameConfig] = React.useState<GameConfig>({
    rows: DEFAULT_STATE.rows,
    columns: DEFAULT_STATE.columns,
    bombs: DEFAULT_STATE.bombs,
  });

  const handleNewGame = React.useCallback(() => {
    dispatch({ type: ActionTypes.RESET_GAME });
  }, [dispatch]);

  const handleSelectPreset = React.useCallback(
    (config: GameConfig) => {
      dispatch({ type: ActionTypes.RESET_GAME, state: createResetGameState(config) });
    },
    [dispatch],
  );

  const handleOpenCustomDialog = React.useCallback(() => {
    setCustomGameConfig({ rows: state.rows, columns: state.columns, bombs: state.bombs });
    setIsCustomDialogOpen(true);
  }, [state.bombs, state.columns, state.rows]);

  const handleCloseCustomDialog = React.useCallback(() => {
    setIsCustomDialogOpen(false);
  }, []);

  const handleSubmitCustomDialog = React.useCallback(
    (config: GameConfig) => {
      const normalizedConfig = normalizeCustomGameConfig(config);
      setCustomGameConfig(normalizedConfig);
      setIsCustomDialogOpen(false);
      dispatch({ type: ActionTypes.RESET_GAME, state: createResetGameState(normalizedConfig) });
    },
    [dispatch],
  );

  return (
    <Window
      title="Minesweeper"
      renderMenuItems={() => (
        <Menus
          onNewGame={handleNewGame}
          onSelectPreset={handleSelectPreset}
          onOpenCustomDialog={handleOpenCustomDialog}
        />
      )}>
      <div className={sharedStyles.outset}>
        <GameStatus state={state} dispatch={dispatch} />
        <GameBoard state={state} dispatch={dispatch} />
      </div>
      <CustomGameDialog
        isOpen={isCustomDialogOpen}
        initialConfig={customGameConfig}
        onClose={handleCloseCustomDialog}
        onSubmit={handleSubmitCustomDialog}
      />
    </Window>
  );
}
