import classNames from 'classnames';
import * as React from 'react';

import type { MenuGroups } from '@/Constants';
import type { MouseEventType } from '@/Types';

import styles from '@/Window.module.css';

function LineIcon() {
  return <div className={styles.lineIcon} />;
}

function MinimizeIcon() {
  return <div className={styles.minimizeIcon} />;
}

interface TitleBarButtonProps {
  children: React.ReactNode;
  className?: string;
}

function TitleBarButton({ children, className }: TitleBarButtonProps) {
  return (
    <div className={classNames(styles.button, styles.nonDraggable, className)} data-window-no-drag>
      {children}
    </div>
  );
}

interface MenuBarProps {
  children: React.ReactNode;
}

function MenuBar({ children }: MenuBarProps) {
  return <div className={styles.menuBar}>{children}</div>;
}

interface MenuItemProps {
  children: React.ReactNode;
  id: MenuGroups;
  onClick: (event: MouseEventType, id: string) => void;
  active?: boolean;
  renderMenuList: (id: MenuGroups) => React.ReactNode;
}

export function MenuItem({ active = false, id, children, onClick, renderMenuList }: MenuItemProps) {
  return (
    <div
      onClick={(event) => onClick(event, id)}
      className={classNames({
        [styles.menuItem]: true,
        [styles.active]: active,
      })}>
      {children}
      {active ? <div className={styles.menuList}>{renderMenuList(id)}</div> : null}
    </div>
  );
}

interface MenuListItemProps {
  children: React.ReactNode;
  onClick: () => void;
  separator?: boolean;
}

export function MenuListItem({ children, separator = false, onClick }: MenuListItemProps) {
  return (
    <div
      className={classNames({
        [styles.menuListItem]: true,
        [styles.separator]: separator,
      })}
      onClick={onClick}>
      {children}
    </div>
  );
}

interface TitleBarProps {
  children: React.ReactNode;
}

const TitleBar = React.forwardRef<HTMLDivElement, TitleBarProps>(function TitleBar({ children }, ref) {
  return (
    <div ref={ref} className={styles.titleBar} data-window-drag-handle>
      <TitleBarButton>
        <LineIcon />
      </TitleBarButton>
      <div className={styles.title}>{children}</div>
      <TitleBarButton>
        <MinimizeIcon />
      </TitleBarButton>
    </div>
  );
});

interface WindowProps {
  title: React.ReactNode;
  renderMenuItems?: () => React.ReactNode;
  overlay?: React.ReactNode;
  children: React.ReactNode;
}

export default function Window({ children, title, renderMenuItems, overlay }: WindowProps) {
  return (
    <div className={styles.window} data-window-root>
      <TitleBar>{title}</TitleBar>
      {renderMenuItems != null ? <MenuBar>{renderMenuItems()}</MenuBar> : null}
      {children}
      {overlay != null ? <div className={styles.overlay}>{overlay}</div> : null}
    </div>
  );
}
