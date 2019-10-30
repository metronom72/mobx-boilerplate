import { ErrorType } from '@@store/error/types'
import { NotificationType, NotificationTypes } from '@@store/notification/types'
import { FieldTypes, ICommonStore } from '@@store/types'
import { notInit } from '@@utils/types'
import uuid from 'uuid'
import DefaultConfig from '../../default.config.json'
import {
  IConfiguration,
  IConfigurationConstants,
  IConfigurationStore,
  IDatabase,
  IEndpointsConstants,
  IMocks,
  INetworkConfiguration,
  IPaging,
  IRequest,
  IRoutes,
  ITimeoutConstants,
  SlashOperations,
} from './types'

export class DraftConfigurationStore implements IConfigurationStore {
  public get isFetching(): boolean {
    notInit()
    return false
  }

  public get isProd() {
    notInit()
    return false
  }

  public get isDev() {
    notInit()
    return false
  }

  public get isTest() {
    notInit()
    return false
  }

  public get online() {
    notInit()
    return false
  }

  public get storeName() {
    notInit()
    return 'Configuration'
  }

  public get editable() {
    return true
  }

  public get rows() {
    return [
      {
        fieldName: 'isProd',
        fieldType: FieldTypes.TOGGLE,
        title: 'Продакшн билд?',
      },
      {
        fieldName: 'isDev',
        fieldType: FieldTypes.TOGGLE,
        title: 'Девелопмент билд?',
      },
      {
        fieldName: 'isTest',
        fieldType: FieldTypes.TOGGLE,
        title: 'Тест билд?',
      },
      {
        editble: true,
        fieldName: 'online',
        fieldType: FieldTypes.TOGGLE,
        title: 'Находимся онлайн?',
      },
      {
        editble: true,
        fieldName: 'configured',
        fieldType: FieldTypes.TOGGLE,
        title: 'Приложение было успешно сконфигурировано?',
      },
      {
        editble: true,
        fieldName: 'isFetching',
        fieldType: FieldTypes.TOGGLE,
        title: 'Выполняется запрос?',
      },
      {
        fieldName: 'environment',
        fieldType: FieldTypes.INPUT,
        title: 'Название окружения',
      },
      {
        fieldName: 'config',
        fieldType: FieldTypes.JSON,
        title: 'Базовая Конфигурация',
      },
    ]
  }

  public stores: { [storeNameLowerCase: string]: ICommonStore } = {}

  public config: IConfiguration

  public base: string = ''

  public configured: boolean = false

  public network: INetworkConfiguration = {
    message: null,
    requests: [],
  }

  private readonly environment: string = process.env.NODE_ENV

  constructor() {
    const CONSTANTS = DefaultConfig.CONSTANTS as IConfigurationConstants
    const ENDPOINTS = DefaultConfig.ENDPOINTS as IEndpointsConstants
    const TIMEOUTS = DefaultConfig.TIMEOUTS as ITimeoutConstants
    const MOCK = DefaultConfig.MOCK as IMocks
    const DATABASE = DefaultConfig.DATABASE as IDatabase
    const PAGING = DefaultConfig.PAGING as IPaging
    const ROUTES = DefaultConfig.ROUTES as IRoutes

    this.config = {
      CONSTANTS,
      DATABASE,
      ENDPOINTS,
      MOCK,
      PAGING,
      ROUTES,
      TIMEOUTS,
    }
  }

  public refetch = async (): Promise<void> => {
    notInit()
  }

  /**
   * Функция для единообразного создания ссылок
   */
  public createUrl = (postfix: string): string => {
    notInit()
    return ''
  }

  /**
   * Функция для единообразного создания ссылок
   */
  public createAbsoluteUrl = (postfix: string): string => {
    notInit()
    return ''
  }

  /**
   * Функция для единообразного создания ссылок
   */
  public createBackendUrl = (
    endpoint: string,
    postfix: string = this.config.ENDPOINTS.API!
  ): string => {
    notInit()
    return ''
  }

  public fetchConfig = (): void => {
    notInit()
  }

  public startRequest = (message: string, request = {}): NodeJS.Timeout => {
    const requestId = setTimeout(() => {
      request = {
        id: requestId,
        message,
        ...request,
      }

      this.network.requests.push(request as IRequest)
      if (message) {
        this.network.message = message
      }
    }, 300)

    return requestId
  }

  public stopRequest = (id: NodeJS.Timeout): void => {
    if (id) {
      const found = this.network.requests.find(request => request.id === id)
      if (found) {
        this.network.requests = this.network.requests.filter(request => request.id !== id)
      } else {
        clearTimeout(id)
      }
    }
  }

  /**
   * Обертка для функции replace из стора navigation
   */
  public replace = (str: string): void => {
    notInit()
  }

  /**
   * Обертка для функции згыр из стора navigation
   */
  public push = (str: string): void => {
    notInit()
  }

  /**
   * Обертка для функции добавления уведомлений из стора notification
   */
  public addNotification = (notification: {
    id?: string
    message: string
    createdAt?: Date
    storeName: string
    timeout?: number | null
  }): NotificationType => {
    notInit()
    return {
      createdAt: new Date(),
      enabled: false,
      id: uuid.v4().toString(),
      message: 'Not available',
      storeName: this.storeName,
      timeout: 1000,
      type: NotificationTypes.DANGER,
    }
  }

  /**
   * Обертка для функции удаления уведомлений из стора notification
   */
  public removeNotification = (id: string): NotificationType | null => {
    notInit()
    return {
      createdAt: new Date(),
      enabled: false,
      id: uuid.v4().toString(),
      message: 'Not available',
      storeName: this.storeName,
      timeout: 1000,
      type: NotificationTypes.DANGER,
    }
  }

  /**
   * Обертка для функции добавления ошибки из стора errors
   */
  public addError = (errors: ErrorType[]): Array<ErrorType | null> => {
    notInit()
    return []
  }

  /**
   * Обертка для функции удаления ошибки из стора errors
   */
  public removeError = (ids: string[]): Array<ErrorType | null> => {
    notInit()
    return []
  }

  public postData = async (remoteUrl: string, body: object, message?: string): Promise<any> => {
    notInit()
    return
  }

  public getData = async (remoteUrl: string, message?: string): Promise<any> => {
    notInit()
    return
  }

  public putData = async (remoteUrl: string, body: object, message?: string): Promise<any> => {
    notInit()
    return
  }

  public deleteData = async (remoteUrl: string, message?: string): Promise<any> => {
    notInit()
    return
  }

  public clearStorage = () => {
    notInit()
    return
  }

  private slash = ({
    start,
    end,
    str,
  }: {
    start?: SlashOperations | null
    end?: SlashOperations | null
    str: string
  }): string => {
    notInit()
    return ''
  }
}

export default new DraftConfigurationStore()
