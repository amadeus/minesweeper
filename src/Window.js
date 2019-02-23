// @flow strict

import React, {type Node} from 'react';
import classNames from 'classnames';
import styles from './Window.module.css';
import type {MouseEventType} from './Types';

const LineIcon = () => <div className={styles.lineIcon} />;

const MinimizeIcon = () => <div className={styles.minimizeIcon} />;

type TitleBarButtonProps = {|
  children?: Node,
|};

const TitleBarButton = ({children}: TitleBarButtonProps) => <div className={styles.button}>{children}</div>;

type MenuBarProps = {|
  children: Node,
|};

const MenuBar = ({children}: MenuBarProps) => <div className={styles.menuBar}>{children}</div>;

type MenuItemProps = {|
  children: Node,
  id: string,
  onClick: (event: MouseEventType, id: string) => void,
  active?: boolean,
  renderMenuList: (id: string) => Node,
|};

export const MenuItem = ({active = false, id, children, onClick, renderMenuList}: MenuItemProps) => (
  <div onClick={event => onClick(event, id)} className={classNames({[styles.menuItem]: true, [styles.active]: active})}>
    {children}
    {active ? <div className={styles.menuList}>{renderMenuList(id)}</div> : null}
  </div>
);

type MenuListItemProps = {|
  children: Node,
  onClick: () => void,
  separator?: boolean,
|};

export const MenuListItem = ({children, separator = false, onClick}: MenuListItemProps) => (
  <div className={classNames({[styles.menuListItem]: true, [styles.separator]: separator})} onClick={onClick}>
    {children}
  </div>
);

type TitleBarProps = {|
  children: Node,
|};

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

type WindowProps = {|
  title: Node,
  renderMenuItems?: () => Node,
  children: Node,
|};

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
