import DraftConfigurationStore from '@@store/configuration/draft'
import { IConfigurationStore } from '@@store/configuration/types'
import {
  INotificationsStore,
  NotificationType,
  NotificationTypes,
} from '@@store/notification/types'
import invariant from 'invariant'
import { action, observable } from 'mobx'
import uuid from 'uuid'

export class NotificationsStore implements INotificationsStore {
  public readonly storeName = 'Notifications'
  public configuration: IConfigurationStore = DraftConfigurationStore

  @observable
  public notifications: NotificationType[] = []

  @action
  public setConfiguration = async (configuration: IConfigurationStore): Promise<void> => {
    invariant(!!configuration.config, 'Конфигурация корректно не инициализирована')
    this.configuration = configuration
  }

  @action
  public addNotification = (object: {
    id?: string
    message: string
    createdAt?: Date
    storeName: string
    timeout?: number | null
    type?: NotificationTypes
    enabled?: boolean
  }): NotificationType => {
    invariant(this.configuration, 'Конфигурация не иницилизирована')
    invariant(this.storeName, 'Название стора является обязательным параметром!')
    const configuration: IConfigurationStore = this.configuration
    const storeName: string = this.storeName

    invariant(
      configuration.config.TIMEOUTS && configuration.config.TIMEOUTS.NOTIFICATION,
      'Константа TIMEOUTS.NOTIFICATION не объявлена!'
    )

    invariant(object.message, 'Сообщение уведомления отсутствует!')
    invariant(object.storeName, 'Источник уведомления не указан!')

    if (!object.id) {
      object.id = uuid.v4()
    }

    if (!object.timeout && object.timeout !== null) {
      object.timeout = configuration.config.TIMEOUTS.NOTIFICATION
    }

    if (!object.createdAt) {
      object.createdAt = new Date()
    }

    if (!object.type) {
      object.type = NotificationTypes.PRIMARY
    } else {
      invariant(
        Object.values(NotificationTypes).includes(object.type),
        `${object.type} является недопустимым типом уведомления`
      )
    }
    object.enabled = true

    const notification: NotificationType = { ...(object as NotificationType) }

    invariant(
      !this.notifications.find(n => n.id === object.id),
      `Уведомление с id ${object.id} уже существует!`
    )

    this.notifications.push(notification as NotificationType)

    if (notification.timeout) {
      notification.timeoutId = setTimeout(
        () => this.removeNotification(notification.id),
        notification.timeout
      )
    }

    return notification
  }

  @action
  public removeNotification = (id: string, immediately: boolean = false) => {
    invariant(this.configuration, 'Конфигурация не иницилизирована')
    invariant(this.storeName, 'Название стора является обязательным параметром!')
    const configuration: IConfigurationStore = this.configuration
    const storeName: string = this.storeName

    const found: NotificationType | null =
      this.notifications.find(notification => notification.id === id) || null

    if (found && found.timeoutId) {
      clearTimeout(found.timeoutId)
    }

    if (found) {
      found.enabled = false
      if (immediately) {
        this.notifications = this.notifications.filter(notification => notification.id !== id)
      }
    }

    return found
  }

  @action
  public resetNotifications = (): void => {
    this.notifications = []
  }
}

export default NotificationsStore
