import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { observer, inject } from 'mobx-react';

import Loader from '@@components/loader';
import Sidebar from '@@components/sidebar';

import './styles.styl';

@inject('configuration')
@observer
class App extends Component {
  render() {
    const { configuration } = this.props;

    return (
      <div className="layout">
        {configuration.isFetching && <Loader message={configuration.network.message} />}
        <Helmet>
          <meta
            charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <meta
            httpEquiv="x-ua-compatible"
            content="ie=edge" />
          <meta
            name="theme-color"
            content="#ffffff" />
          <link
            rel="manifest"
            href={configuration.createUrl(`manifest.json`)} />
          <link
            rel="shortcut icon"
            href={configuration.createUrl(`favicon.ico`)} />
        </Helmet>
        <Sidebar />
        <div className="page">
          {configuration.configured && <Switch>
            <Route
              component={() => 'FOOBAR'}
            />
          </Switch> }
        </div>
      </div>
    );
  }
}

App.propTypes = {
  configuration: PropTypes.object,
};

export default withRouter(App);
