// @flow strict
import React, {type Node, useState, useEffect} from 'react';
import {MenuItem, MenuListItem} from './Window';
import {MenuItems} from './Constants';
import type {MouseEventType} from './Types';

const separators = new Set(['New']);

function renderMenu(id: string): Node {
  const items = MenuItems[id];
  if (items != null) {
    return items.map(item => (
      <MenuListItem key={`${id}-${item}`} separator={separators.has(item)}>
        {item}
      </MenuListItem>
    ));
  }
  return null;
}

const Menus = () => {
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
      renderMenuList={renderMenu}>
      {name}
    </MenuItem>
  ));
};

export default Menus;
