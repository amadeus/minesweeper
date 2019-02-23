// @flow strict
import React, {type Node, useState, useEffect} from 'react';
import {MenuItem, MenuListItem} from './Window';
import {MenuGroups, MenuItems, GameItems, ActionTypes, DEFAULT_STATE} from './Constants';
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

function renderMenu(id: string, dispatch: Dispatch): Node {
  const items = MenuItems[id];
  if (items != null) {
    return items.map(item => (
      <MenuListItem
        key={`${id}-${item}`}
        separator={separators.has(item)}
        onClick={() => handleMenuListItemClick(id, item, dispatch)}>
        {item.toLowerCase()}
      </MenuListItem>
    ));
  }
  return null;
}

type MenusProps = {|
  dispatch: Dispatch,
|};

const Menus = ({dispatch}: MenusProps) => {
  const [selectedMenu, setSelectedMenu] = useState<?string>(null);
  useEffect(() => {
    const handleOuterClick = () => {
      if (selectedMenu != null) {
        setSelectedMenu(null);
      }
    };
    document.addEventListener('click', handleOuterClick);
    return () => document.removeEventListener('click', handleOuterClick);
  });
  return Object.keys(MenuItems).map<Node>((name, index) => (
    <MenuItem
      key={name}
      active={name === selectedMenu}
      id={name}
      onClick={(event: MouseEventType, id: string) => {
        event.preventDefault();
        event.stopPropagation();
        if (selectedMenu === id) {
          setSelectedMenu(null);
        } else {
          setSelectedMenu(id);
        }
      }}
      renderMenuList={id => renderMenu(id, dispatch)}>
      {name.toLowerCase()}
    </MenuItem>
  ));
};

export default Menus;
