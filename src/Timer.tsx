import {useState, useEffect} from 'react';
import LCDDisplay from './LCDDisplay';
import {ActionTypes} from './Constants';
import type {Dispatch} from './Types';

const MAX_SECONDS = 999;

interface TimerProps {
  started: boolean;
  gameOver: boolean;
  dispatch: Dispatch;
}

export default function Timer({started, gameOver, dispatch}: TimerProps) {
  const [time, setTime] = useState(0);
  useEffect(() => {
    let timeoutID: NodeJS.Timeout;
    if (started && !gameOver) {
      timeoutID = setTimeout(() => {
        if (time >= MAX_SECONDS) {
          dispatch({type: ActionTypes.SET_GAME_OVER});
        } else {
          setTime((t) => Math.min(t + 1, MAX_SECONDS));
        }
      }, 1000);
    }
    return () => clearTimeout(timeoutID);
  }, [time, started, gameOver, dispatch]);
  return <LCDDisplay value={time} digits={3} />;
}
