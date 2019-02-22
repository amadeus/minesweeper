// @flow strict

import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import Helment from 'react-helmet';
import Minesweeper from './Minesweeper.v2';
import './index.css';

const root = document.getElementById('root');
if (root == null) {
  throw new Error('Minesweeper - invalid root');
}
ReactDOM.render(
  <Fragment>
    <Helment>
      <title>Minesweeper</title>
    </Helment>
    <Minesweeper />
  </Fragment>,
  root
);
