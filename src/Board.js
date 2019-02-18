// @flow strict
import React, {type Node} from 'react';
import classNames from 'classnames';
import {CELL_SIZE} from './Constants';
import sharedStyles from './Shared.module.css';
import styles from './Board.module.css';

type BoardProps = {|
  size: number,
  disable?: boolean,
  children: Node,
|};

const Board = ({size, children, disable = false}: BoardProps) => (
  <div className={classNames(sharedStyles.inset, {[styles.disable]: disable})}>
    <div
      className={styles.grid}
      style={{
        gridTemplateColumns: `repeat(${size}, ${CELL_SIZE}px)`,
        gridTemplateRows: `repeat(${size}, ${CELL_SIZE}px)`,
      }}>
      {children}
    </div>
  </div>
);

export default Board;
