// @flow strict
import React, {type Node} from 'react';
import classNames from 'classnames';
import {CELL_SIZE} from './Constants';
import sharedStyles from './Shared.module.css';
import styles from './Board.module.css';

type BoardProps = {|
  rows: number,
  columns: number,
  disable?: boolean,
  children: Node,
|};

const Board = ({rows, columns, children, disable = false}: BoardProps) => (
  <div className={classNames(sharedStyles.inset, {[styles.disable]: disable})}>
    <div
      className={styles.grid}
      style={{
        gridTemplateColumns: `repeat(${columns}, ${CELL_SIZE}px)`,
        gridTemplateRows: `repeat(${rows}, ${CELL_SIZE}px)`,
      }}>
      {children}
    </div>
  </div>
);

export default Board;
