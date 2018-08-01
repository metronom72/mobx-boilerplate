import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import icons from './icons';

import './styles.styl';

export class IconComponent extends Component {
  render() {
    const { name, className, style, ...props } = this.props;
    return (
      <span {...props} style={style} className="icon">
        <img src={icons[name]} className={classnames(className, "_svg")} />
      </span>
    );
  }
}

IconComponent.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default IconComponent;
