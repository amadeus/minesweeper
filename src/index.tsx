import React from 'react';
import ReactDOM from 'react-dom';
import Helment from 'react-helmet';
import Minesweeper from './Minesweeper';
import './index.css';

const root = document.getElementById('root');
root != null &&
  ReactDOM.render(
    <>
      <Helment>
        <title>Minesweeper</title>
      </Helment>
      <Minesweeper />
    </>,
    root
  );
