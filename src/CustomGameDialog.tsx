import classNames from 'classnames';
import * as React from 'react';

import {
  MAX_CUSTOM_COLUMNS,
  MAX_CUSTOM_ROWS,
  MIN_CUSTOM_BOMBS,
  MIN_CUSTOM_COLUMNS,
  MIN_CUSTOM_ROWS,
} from '@/Constants';
import type { GameConfig } from '@/Types';
import { clamp, cleanNaN, getMaximumCustomBombs, isValueOutsideRange } from '@/Utils';
import Window from '@/Window';

import styles from '@/CustomGameDialog.module.css';
import sharedStyles from '@/Shared.module.css';

interface CustomGameDialogProps {
  anchorRect: DOMRect | null;
  initialConfig: GameConfig;
  onClose(): void;
  onSubmit(config: GameConfig): void;
}

export default React.memo(function CustomGameDialog({
  anchorRect,
  initialConfig,
  onClose,
  onSubmit,
}: CustomGameDialogProps) {
  const [values, setValues] = React.useState<GameConfig>(() => ({ ...initialConfig }));
  const windowRef = React.useRef<HTMLDivElement>(null);

  const bombMax = getMaximumCustomBombs(
    clamp(values.rows, MIN_CUSTOM_ROWS, MAX_CUSTOM_ROWS),
    clamp(values.columns, MIN_CUSTOM_COLUMNS, MAX_CUSTOM_COLUMNS)
  );
  const isColumnsInvalid = isValueOutsideRange(values.columns, MIN_CUSTOM_COLUMNS, MAX_CUSTOM_COLUMNS);
  const isRowsInvalid = isValueOutsideRange(values.rows, MIN_CUSTOM_ROWS, MAX_CUSTOM_ROWS);
  const isBombsInvalid = isValueOutsideRange(values.bombs, MIN_CUSTOM_BOMBS, bombMax);
  const hasInvalidValues = isColumnsInvalid || isRowsInvalid || isBombsInvalid;
  const handleChange = React.useCallback(
    (key: keyof GameConfig) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((currentValues) => ({ ...currentValues, [key]: Number.parseInt(event.target.value, 10) }));
    },
    []
  );

  const handleSubmit = React.useCallback(
    (event: React.SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!hasInvalidValues) {
        onSubmit({ ...values });
      }
    },
    [onSubmit, values, hasInvalidValues]
  );

  React.useLayoutEffect(() => {
    const windowElement = windowRef.current;
    if (windowElement == null || anchorRect == null) {
      return;
    }

    const dialogRect = windowElement.getBoundingClientRect();
    let nextX = anchorRect.left + (anchorRect.width - dialogRect.width) / 2;
    let nextY = anchorRect.top + (anchorRect.height - dialogRect.height) / 2;

    if (dialogRect.width >= window.innerWidth) {
      nextX = 0;
    } else {
      nextX = Math.min(Math.max(0, nextX), window.innerWidth - dialogRect.width);
    }

    if (dialogRect.height >= window.innerHeight) {
      nextY = 0;
    } else {
      nextY = Math.min(Math.max(0, nextY), window.innerHeight - dialogRect.height);
    }

    windowElement.style.setProperty('--pos-x', `${nextX}px`);
    windowElement.style.setProperty('--pos-y', `${nextY}px`);
  }, [anchorRect]);

  return (
    <div className={styles.root}>
      <div className={styles.backdrop} onClick={onClose} />
      <Window ref={windowRef} className={styles.window} title="Custom Field">
        <form className={styles.form} noValidate onSubmit={handleSubmit}>
          <div className={styles.fields}>
            <label className={styles.label} htmlFor="custom-columns">
              Width:
            </label>
            <input
              id="custom-columns"
              className={classNames(styles.input, sharedStyles.inset, { [styles.inputInvalid]: isColumnsInvalid })}
              inputMode="numeric"
              placeholder={`${MIN_CUSTOM_COLUMNS}`}
              min={MIN_CUSTOM_COLUMNS}
              max={MAX_CUSTOM_COLUMNS}
              name="columns"
              type="number"
              value={cleanNaN(values.columns)}
              onChange={handleChange('columns')}
            />
            <span className={styles.suffix}>/ {MAX_CUSTOM_COLUMNS}</span>
            <label className={styles.label} htmlFor="custom-rows">
              Height:
            </label>
            <input
              id="custom-rows"
              className={classNames(styles.input, sharedStyles.inset, { [styles.inputInvalid]: isRowsInvalid })}
              inputMode="numeric"
              placeholder={`${MIN_CUSTOM_ROWS}`}
              min={MIN_CUSTOM_ROWS}
              max={MAX_CUSTOM_ROWS}
              name="rows"
              type="number"
              value={cleanNaN(values.rows)}
              onChange={handleChange('rows')}
            />
            <span className={styles.suffix}>/ {MAX_CUSTOM_ROWS}</span>
            <label className={styles.label} htmlFor="custom-bombs">
              Mines:
            </label>
            <input
              id="custom-bombs"
              className={classNames(styles.input, sharedStyles.inset, { [styles.inputInvalid]: isBombsInvalid })}
              inputMode="numeric"
              placeholder={`${MIN_CUSTOM_BOMBS}`}
              min={MIN_CUSTOM_BOMBS}
              max={bombMax}
              name="bombs"
              type="number"
              value={cleanNaN(values.bombs)}
              onChange={handleChange('bombs')}
            />
            <span className={styles.suffix}>/ {bombMax}</span>
          </div>
          <div className={styles.actions}>
            <button className={`${styles.button} ${sharedStyles.outset}`} type="submit">
              OK
            </button>
          </div>
        </form>
      </Window>
    </div>
  );
});
