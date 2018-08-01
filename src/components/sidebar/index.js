import React, { PureComponent } from 'react';
import Item from './item';
import items from './items';

import Logo from '@@components/logo';

import './styles.styl';

export class SidebarComponent extends PureComponent {
  render() {
    return (
      <div className="sidebar">
        <div className="sidebar__logo">
          <Logo />
        </div>
        <div className="sidebar-menu">
          {items.map(item => (
            <Item
              className="sidebar-menu__item"
              key={item.id}
              item={item}
              isActive={!item.disabled}
              onClick={item}
            />
          ))}
        </div>
      </div>
    );
  }
}

SidebarComponent.propTypes = {

};

export default SidebarComponent;
