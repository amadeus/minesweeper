// @flow strict
import React, {useState, useEffect} from 'react';
import LCDDisplay from './LCDDisplay';
import {setLosingBoard} from './Utils';
import type {StateUpdater} from './Types';

const MAX_SECONDS = 999;

type TimerProps = {|
  started: boolean,
  gameOver: boolean,
  setState: StateUpdater,
|};

const Timer = ({started, gameOver, setState}: TimerProps) => {
  const [time, setTime] = useState(0);
  useEffect(() => {
    let timeoutID;
    if (started && !gameOver) {
      timeoutID = setTimeout(() => {
        if (time >= MAX_SECONDS) {
          setState(s => {
            let {board} = s;
            board = setLosingBoard(null, board);
            return {...s, board, gameOver: true, hasWon: false};
          });
        } else {
          setTime(t => Math.min(t + 1, MAX_SECONDS));
        }
      }, 1000);
    }
    return () => clearTimeout(timeoutID);
  }, [time, started, gameOver]);
  return <LCDDisplay value={time} digits={3} />;
};

export default Timer;
