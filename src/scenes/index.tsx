import Configuration from '@@store/configuration'
import { IConfigurationStore } from '@@store/configuration/types'
import Errors from '@@store/error'
import { IErrorsStore } from '@@store/error/types'
import Navigation from '@@store/navigation'
import { INavigationStore } from '@@store/navigation/types'
import NotificationsStore from '@@store/notification'
import { INotificationsStore } from '@@store/notification/types'
import { Provider } from 'mobx-react'
import React from 'react'
import Router from './router'

// tslint:disable-next-line: no-empty-interface
interface Props {}
// tslint:disable-next-line: no-empty-interface
interface State {}

const errors: IErrorsStore = new Errors()
const navigation: INavigationStore = new Navigation()
const notifications: INotificationsStore = new NotificationsStore()
const configuration: IConfigurationStore = new Configuration(errors, navigation, notifications)

export class Application extends React.PureComponent<Props, State> {
  public render() {
    return (
      <Provider
        errors={errors}
        configuration={configuration}
        navigation={navigation}
        notifications={notifications}
      >
        <Router />
      </Provider>
    )
  }
}

export default Application
