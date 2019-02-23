// @flow strict
import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import Helment from 'react-helmet';
import Minesweeper from './Minesweeper';
import Window from './Window';
import Menus from './Menus';
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
    <Window title="Minesweeper" renderMenuItems={() => <Menus />}>
      <Minesweeper />
    </Window>
  </Fragment>,
  root
);
