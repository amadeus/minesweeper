// @flow strict

import React from 'react';
import keyMirror from 'keymirror';
import classNames from 'classnames';
import styles from './FaceButton.module.css';

const FaceTypes = Object.freeze(
  keyMirror({
    SMILE: null,
    OHH: null,
    DED: null,
    KOOL: null,
  })
);

function getClass(type: $Values<typeof FaceTypes>): string {
  switch (type) {
    case FaceTypes.OHH:
      return styles.ohh;
    case FaceTypes.DED:
      return styles.ded;
    case FaceTypes.KOOL:
      return styles.kool;
    case FaceTypes.SMILE:
    default:
      return styles.smile;
  }
}

type FaceButtonProps = {|
  type: $Values<typeof FaceTypes>,
  onClick: () => void,
|};

const FaceButton = ({type, onClick}: FaceButtonProps) => (
  <div className={classNames(styles.container, getClass(type))} onClick={onClick} />
);

FaceButton.Types = FaceTypes;

export default FaceButton;
