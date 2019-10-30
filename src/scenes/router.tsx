import Notification from '@@components/notification'
import Sample from '@@components/sample'
import { IConfigurationStore } from '@@store/configuration/types'
import { INavigationStore } from '@@store/navigation/types'
import { INotificationsStore, NotificationType } from '@@store/notification/types'
import { inject, observer } from 'mobx-react'
import React from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import Stores from './stores'

interface Props {
  configuration?: IConfigurationStore
  navigation?: INavigationStore
  notifications?: INotificationsStore
}
// tslint:disable-next-line: no-empty-interface
interface State {}

@inject('configuration', 'navigation', 'notifications')
@observer
export class Scenes extends React.Component<Props, State> {
  public render() {
    const { configuration, notifications, navigation } = this.props
    const { createUrl, config } = configuration!

    const configured = configuration!.configured

    return (
      <Router history={navigation!.history}>
        {configured && (
          <div>
            {notifications!.notifications.map(({ id, ...notification }: NotificationType) => (
              <Notification key={id} id={id} remove={this.removeNotification} {...notification} />
            ))}
            <div>
              <Switch>
                <Route path={createUrl(config!.ROUTES.ROOT)}>
                  <Sample />
                </Route>
              </Switch>
              <Stores />
            </div>
          </div>
        )}
      </Router>
    )
  }
  private removeNotification = (id: string) => this.props.notifications!.removeNotification(id)
}

export default Scenes
