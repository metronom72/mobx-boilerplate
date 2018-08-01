import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';

import Configuration from '@@store/configuration';
import App from '@@store/application';

import Application from './views';

const application = new App();
const configuration = new Configuration(application);

const ApplicationProvider = () => {
  return (
    <Provider
      configuration={configuration}
      application={application}
    >
      <BrowserRouter>
        <Application />
      </BrowserRouter>
    </Provider>
  );
};

export default ApplicationProvider;
