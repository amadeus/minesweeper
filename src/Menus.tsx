import * as React from 'react';

import { GameItems, HelpItems, MenuGroups, MenuItems } from '@/Constants';
import type { MouseEventType } from '@/Types';
import { MenuItem, MenuListItem } from '@/Window';

const separators = new Set(['NEW']);

interface PresetConfig {
  rows: number;
  columns: number;
  bombs: number;
}

interface MenuActionHandlers {
  onNewGame: () => void;
  onSelectPreset: (config: PresetConfig) => void;
  onOpenCustomDialog: () => void;
}

function handleMenuListItemClick(group: string, item: string, handlers: MenuActionHandlers) {
  if (group === MenuGroups.GAME) {
    switch (item) {
      case GameItems.NEW:
        handlers.onNewGame();
        return;
      case GameItems.BEGINNER:
        handlers.onSelectPreset({ rows: 8, columns: 8, bombs: 10 });
        return;
      case GameItems.INTERMEDIATE:
        handlers.onSelectPreset({ rows: 16, columns: 16, bombs: 40 });
        return;
      case GameItems.EXPERT:
        handlers.onSelectPreset({ rows: 16, columns: 30, bombs: 99 });
        return;
      case GameItems.CUSTOM:
        handlers.onOpenCustomDialog();
        return;
      default:
        return;
    }
  } else if (group === MenuGroups.HELP) {
    console.log('not yet implemented');
  }
}

function renderMenu(id: MenuGroups, handlers: MenuActionHandlers): React.ReactNode {
  const items = MenuItems[id];
  if (items != null) {
    return items.map((item: GameItems | HelpItems) => (
      <MenuListItem
        key={`${id}-${item}`}
        separator={separators.has(item)}
        onClick={() => handleMenuListItemClick(id, item, handlers)}>
        {item.toLowerCase()}
      </MenuListItem>
    ));
  }
  return undefined;
}

function getMenuGroupFromString(id: string): MenuGroups {
  switch (id) {
    case MenuGroups.HELP:
      return MenuGroups.HELP;
    case MenuGroups.GAME:
    default:
      return MenuGroups.GAME;
  }
}

interface MenusProps {
  onNewGame: () => void;
  onSelectPreset: (config: PresetConfig) => void;
  onOpenCustomDialog: () => void;
}

export default function Menus({ onNewGame, onSelectPreset, onOpenCustomDialog }: MenusProps) {
  const [selectedMenu, setSelectedMenu] = React.useState<string | null>(null);
  const handlers = React.useMemo<MenuActionHandlers>(
    () => ({ onNewGame, onSelectPreset, onOpenCustomDialog }),
    [onNewGame, onSelectPreset, onOpenCustomDialog],
  );

  React.useEffect(() => {
    const handleOuterClick = () => {
      if (selectedMenu != null) {
        setSelectedMenu(null);
      }
    };
    document.addEventListener('click', handleOuterClick);
    return () => document.removeEventListener('click', handleOuterClick);
  });
  return (
    <>
      {Object.keys(MenuItems).map<React.ReactNode>((name) => (
        <MenuItem
          key={name}
          active={name === selectedMenu}
          id={getMenuGroupFromString(name)}
          onClick={(event: MouseEventType, id: string) => {
            event.preventDefault();
            event.stopPropagation();
            if (selectedMenu === id) {
              setSelectedMenu(null);
            } else {
              setSelectedMenu(id);
            }
          }}
          renderMenuList={(id) => renderMenu(id, handlers)}>
          {name.toLowerCase()}
        </MenuItem>
      ))}
    </>
  );
}
