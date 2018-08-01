import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import './styles.styl';

@inject('configuration')
@observer
export class LogoComponent extends React.Component {
  render() {
    const { configuration = {} } = this.props;
    const { config } = configuration;
    return (
      <div className="logo">
        {
          config && config.LOGO ?
            <img src={config.LOGO} /> :
            config && config.PARTNER_NAME || "Логотип"
        }
      </div>
    );
  }
}

LogoComponent.propTypes = {
  configuration: PropTypes.object,
};

export default LogoComponent;
