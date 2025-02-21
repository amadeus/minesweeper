import classNames from 'classnames';
import styles from './FaceButton.module.css';

export enum FaceTypes {
  SMILE,
  OHH,
  DED,
  KOOL,
}

function getClass(type: FaceTypes): string {
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

interface FaceButtonProps {
  type: FaceTypes;
  onClick: () => void;
}

export default function FaceButton({type, onClick}: FaceButtonProps) {
  return <div className={classNames(styles.container, getClass(type))} onClick={onClick} />;
}
