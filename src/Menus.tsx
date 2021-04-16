import * as React from 'react';
import {MenuItem, MenuListItem} from './Window';
import {MenuGroups, MenuItems, GameItems, ActionTypes, DEFAULT_STATE, HelpItems} from './Constants';
import type {MouseEventType, Dispatch} from './Types';

const separators = new Set(['NEW']);

function handleMenuListItemClick(group: string, item: string, dispatch: Dispatch) {
  if (group === MenuGroups.GAME) {
    switch (item) {
      case GameItems.NEW:
        dispatch({type: ActionTypes.RESET_GAME});
        return;
      case GameItems.BEGINNER:
        dispatch({type: ActionTypes.RESET_GAME, state: {...DEFAULT_STATE, rows: 8, columns: 8, bombs: 10}});
        return;
      case GameItems.INTERMEDIATE:
        dispatch({type: ActionTypes.RESET_GAME, state: {...DEFAULT_STATE, rows: 16, columns: 16, bombs: 40}});
        return;
      case GameItems.EXPERT:
        dispatch({type: ActionTypes.RESET_GAME, state: {...DEFAULT_STATE, rows: 16, columns: 30, bombs: 99}});
        return;
      default:
        console.log('not yet implemented');
        return;
    }
  } else if (group === MenuGroups.HELP) {
    console.log('not yet implemented');
  }
}

function renderMenu(id: MenuGroups, dispatch: Dispatch): React.ReactNode {
  const items = MenuItems[id];
  if (items != null) {
    return items.map((item: GameItems | HelpItems) => (
      <MenuListItem
        key={`${id}-${item}`}
        separator={separators.has(item)}
        onClick={() => handleMenuListItemClick(id, item, dispatch)}>
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
  dispatch: Dispatch;
}

function Menus({dispatch}: MenusProps) {
  const [selectedMenu, setSelectedMenu] = React.useState<string | null>(null);
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
      {Object.keys(MenuItems).map<React.ReactNode>((name, index) => (
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
          renderMenuList={(id) => renderMenu(id, dispatch)}>
          {name.toLowerCase()}
        </MenuItem>
      ))}
    </>
  );
}

export default Menus;
