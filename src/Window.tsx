import classNames from 'classnames';

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
  onClick?(): void;
}

function TitleBarButton({ children, className, onClick }: TitleBarButtonProps) {
  return (
    <div
      className={classNames(styles.button, styles.nonDraggable, className, {
        [styles.buttonInteractive]: onClick != null,
      })}
      data-no-drag
      onClick={onClick}>
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
  onMinimizeClick?(): void;
}

function TitleBar({ children, onMinimizeClick }: TitleBarProps) {
  return (
    <div className={styles.titleBar} data-drag-handle>
      <TitleBarButton>
        <LineIcon />
      </TitleBarButton>
      <div className={styles.title}>{children}</div>
      <TitleBarButton onClick={onMinimizeClick}>
        <MinimizeIcon />
      </TitleBarButton>
    </div>
  );
}

interface WindowProps {
  className?: string;
  title: React.ReactNode;
  renderMenuItems?(): React.ReactNode;
  overlay?: React.ReactNode;
  children: React.ReactNode;
  draggable?: boolean;
  onMinimizeClick?(): void;
  ref?: React.Ref<HTMLDivElement>;
}

function Window({
  children,
  className,
  title,
  renderMenuItems,
  overlay,
  draggable = true,
  onMinimizeClick,
  ref,
}: WindowProps) {
  console.log(ref);
  return (
    <div ref={ref} className={classNames(styles.window, className)} {...(draggable ? { 'data-draggable': '' } : {})}>
      <TitleBar onMinimizeClick={onMinimizeClick}>{title}</TitleBar>
      {renderMenuItems != null ? <MenuBar>{renderMenuItems()}</MenuBar> : null}
      {children}
      {overlay != null ? <div className={styles.overlay}>{overlay}</div> : null}
    </div>
  );
}

export default Window;
