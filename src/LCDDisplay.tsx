import React from 'react';
import classNames from 'classnames';
import sharedStyles from './Shared.module.css';
import styles from './LCDDisplay.module.css';

function getValueClass(value: string): string | undefined {
  switch (value) {
    case '0':
      return styles.value0;
    case '1':
      return styles.value1;
    case '2':
      return styles.value2;
    case '3':
      return styles.value3;
    case '4':
      return styles.value4;
    case '5':
      return styles.value5;
    case '6':
      return styles.value6;
    case '7':
      return styles.value7;
    case '8':
      return styles.value8;
    case '9':
      return styles.value9;
    case '-':
      return styles.negative;
    default:
      return undefined;
  }
}

interface LCDDisplayProps {
  value: number;
  digits?: number | undefined;
}

export default function LCDDisplay({value, digits = 3}: LCDDisplayProps) {
  return (
    <div className={classNames(styles.container, sharedStyles.inset)}>
      {String(value)
        .replace('-', '')
        .padStart(digits, '0')
        .split('')
        .map((v, index) => {
          let _v = v;
          if (value < 0 && index === 0) {
            _v = '-';
          }
          return (
            <span key={index} className={classNames(styles.unit, getValueClass(_v))}>
              {_v}
            </span>
          );
        })}
    </div>
  );
}
