import { ICommonStore } from '@@store/types'

/**
 * Типы доступных уведомлений
 */
export enum NotificationTypes {
  PRIMARY = 'info',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'error',
}

/**
 * Объект уведомлений
 */
export interface NotificationType {
  /**
   * Уникальный идентификатор уведомления
   * Идентификатор должен быть униклаьным в рамках массива уведомлений
   */
  id: string
  /**
   * Идентификатор таймера удаления уведомления
   */
  timeoutId?: NodeJS.Timeout
  /**
   * Сообщение для вывода пользователю
   */
  message: string
  /**
   * Дата создания уведомления
   */
  createdAt: Date
  /**
   * Источник уведомления
   */
  storeName: string
  /**
   * Задержка переду удалением уведомления
   */
  timeout: number | null
  /**
   * Тип уаведомления
   */
  type: NotificationTypes
  /**
   * Флаг отвечающий за отображение уведомления пользователю
   */
  enabled: boolean
}

/**
 * notification store
 */
export interface INotificationsStore extends ICommonStore {
  /**
   * Функция для добавления нового уведомления
   */
  addNotification: (obj: {
    id?: string
    message: string
    createdAt?: Date
    storeName: string
    timeout?: number | null
  }) => NotificationType
  /**
   * Функция для удаления уведомления
   */
  removeNotification: (id: string) => NotificationType | null
  /**
   * Функция для очистки всех уведомлений
   */
  resetNotifications: () => void
  /**
   * Массив активных уведомлений
   */
  notifications: NotificationType[]
}
