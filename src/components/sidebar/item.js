import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';

import Icon from '@@components/icon';

export class SidebarItemComponent extends Component {
  getIconName = item => `${this.props.item.icon}${this.props.isActive ? 'Active' : 'Inactive'}`

  onClick = event => {
    if (this.props.item.disabled) event.preventDefault();
    else return this.props.onClick && this.props.onClick;
  }

  render() {
    const { className, item, onClick, isActive } = this.props;

    return (
      <NavLink
        className={classnames(className, {
          _active: isActive
        })}
        to={item.link}
        onClick={onClick}
        disabled={item.disabled}
      >
        <span className="sidebar-menu__icon">
          <Icon name={this.getIconName(item)} />
        </span>
        <span className="sidebar-menu__text">{item.name}</span>
      </NavLink>
    );
  }
}

SidebarItemComponent.propTypes = {
  className: PropTypes.string,
  item: PropTypes.object,
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
};


export default SidebarItemComponent;
