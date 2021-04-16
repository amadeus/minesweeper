import * as React from 'react';
import classNames from 'classnames';
import styles from './Window.module.css';
import type {MenuGroups} from './Constants';
import type {MouseEventType} from './Types';

const LineIcon = () => <div className={styles.lineIcon} />;

const MinimizeIcon = () => <div className={styles.minimizeIcon} />;

interface TitleBarButtonProps {
  children: React.ReactNode;
}

const TitleBarButton = ({children}: TitleBarButtonProps) => <div className={styles.button}>{children}</div>;

interface MenuBarProps {
  children: React.ReactNode;
}

const MenuBar = ({children}: MenuBarProps) => <div className={styles.menuBar}>{children}</div>;

interface MenuItemProps {
  children: React.ReactNode;
  id: MenuGroups;
  onClick: (event: MouseEventType, id: string) => void;
  active?: boolean;
  renderMenuList: (id: MenuGroups) => React.ReactNode;
}

export const MenuItem = ({active = false, id, children, onClick, renderMenuList}: MenuItemProps) => (
  <div
    onClick={(event) => onClick(event, id)}
    className={classNames({[styles.menuItem]: true, [styles.active]: active})}>
    {children}
    {active ? <div className={styles.menuList}>{renderMenuList(id)}</div> : null}
  </div>
);

interface MenuListItemProps {
  children: React.ReactNode;
  onClick: () => void;
  separator?: boolean;
}

export const MenuListItem = ({children, separator = false, onClick}: MenuListItemProps) => (
  <div className={classNames({[styles.menuListItem]: true, [styles.separator]: separator})} onClick={onClick}>
    {children}
  </div>
);

interface TitleBarProps {
  children: React.ReactNode;
}

const TitleBar = ({children}: TitleBarProps) => (
  <div className={styles.titleBar}>
    <TitleBarButton>
      <LineIcon />
    </TitleBarButton>
    <div className={styles.title}>{children}</div>
    <TitleBarButton>
      <MinimizeIcon />
    </TitleBarButton>
  </div>
);

interface WindowProps {
  title: React.ReactNode;
  renderMenuItems?: () => React.ReactNode;
  children: React.ReactNode;
}

const Window = ({children, title, renderMenuItems}: WindowProps) => {
  return (
    <div className={styles.window}>
      <TitleBar>{title}</TitleBar>
      {renderMenuItems != null ? <MenuBar>{renderMenuItems()}</MenuBar> : null}
      {children}
    </div>
  );
};

export default Window;
