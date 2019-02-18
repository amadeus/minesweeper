// @flow strict

import typeof {CellStates} from './Constants';

export type CellType = {|
  x: number,
  y: number,
  state: $Values<CellStates>,
  bomb: boolean,
  touching: number,
|};

export type BoardType = Array<Array<CellType>>;
