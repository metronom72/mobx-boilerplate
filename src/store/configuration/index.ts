import { ErrorType, IErrorsStore } from '@@store/error/types'
import { INavigationStore } from '@@store/navigation/types'
import { INotificationsStore, NotificationType } from '@@store/notification/types'
import { ICommonStore } from '@@store/types'
import { checkSSL, deleteData, getData, postData, putData } from '@@utils/api-helpers'
import { asyncForEach } from '@@utils/async'
import invariant from 'invariant'
import { action, computed, observable } from 'mobx'
import url from 'url'
import DefaultConfig from '../../default.config.json'
import {
  DataStorage,
  IConfiguration,
  IConfigurationStore,
  INetworkConfiguration,
  IRequest,
  SlashOperations,
  TokenStorage,
} from './types'

export class Configuration implements IConfigurationStore {
  @computed
  public get isFetching(): boolean {
    return this.network.requests.length > 0
  }

  public get isProd() {
    return this.environment === 'production'
  }

  public get isDev() {
    return this.environment === 'development'
  }

  public get isTest() {
    return this.environment === 'test'
  }

  @observable public online = navigator && navigator.onLine

  public readonly storeName = 'Configuration'

  public stores: { [storeNameLowerCase: string]: ICommonStore } = {}

  @observable public config: IConfiguration = DefaultConfig as IConfiguration

  @observable public base: string

  @observable public configured: boolean = false

  @observable public network: INetworkConfiguration = {
    message: null,
    requests: [],
  }

  private readonly environment: string

  constructor(...stores: ICommonStore[]) {
    /**
     * Выставляем флаг окружения
     */
    this.environment = process.env.NODE_ENV

    /**
     * Ищем префикс для генерации ссылок
     */
    const baseTag = window.document.getElementsByTagName('base')[0]
    const pathname = baseTag
      ? url.parse(window.document.getElementsByTagName('base')[0].href).pathname
      : null
    this.base =
      (process.env.REACT_APP_BASE_URL &&
        this.slash({
          end: SlashOperations.ADD,
          start: SlashOperations.REMOVE,
          str: process.env.REACT_APP_BASE_URL,
        })) ||
      pathname ||
      ''

    /**
     * Получаем объект конфигурации
     */
    this.fetchConfig()
    /**
     * Формируем внутренний объект для представления сторов
     */
    asyncForEach(stores, async store => {
      invariant(
        store.setConfiguration instanceof Function,
        `${store.storeName} не имеет функции setConfiguration`
      )

      await store.setConfiguration(this)

      if (store.storeName) {
        await (this.stores[store.storeName.toLowerCase()] = store)
      }
    })
      .then(() => {
        window.addEventListener('online', () => (this.online = true))
        window.addEventListener('offline', () => (this.online = false))

        this.configured = true
      })
      .catch(err => {
        // tslint:disable-next-line: no-console
        console.log(err)
      })
  }

  public refetch = async (): Promise<void> => {
    asyncForEach(Object.values(this.stores), async store => {
      if (store.fetchAll instanceof Function) {
        await store.fetchAll()
      }
    })
  }

  /**
   * Функция для единообразного создания ссылок
   */
  public createUrl = (postfix: string) => {
    invariant(typeof postfix === 'string', 'Постфикс обязателен!')
    return `${this.slash({
      end: SlashOperations.ADD,
      start: SlashOperations.REMOVE,
      str: this.base,
    })}${this.slash({
      end: SlashOperations.ADD,
      start: SlashOperations.REMOVE,
      str: postfix,
    })}`
  }

  /**
   * Функция для единообразного создания ссылок
   */
  public createAbsoluteUrl = (postfix: string): string => {
    invariant(!!postfix, 'Postfix обязательный параметр!')
    const origin = window.location.origin
    const outUrl: string = `${this.slash({
      end: SlashOperations.ADD,
      start: SlashOperations.REMOVE,
      str: origin,
    })}${this.slash({
      end: SlashOperations.ADD,
      start: SlashOperations.REMOVE,
      str: postfix,
    })}`
    return outUrl
  }

  /**
   * Функция для единообразного создания ссылок
   */
  public createBackendUrl = (
    endpoint: string,
    postfix: string = this.config.ENDPOINTS.API!
  ): string => {
    invariant(!!endpoint, 'Endpoint обязательный параметр!')
    if (this.config && postfix) {
      const outUrl: string = `${this.slash({
        end: SlashOperations.REMOVE,
        start: SlashOperations.REMOVE,
        str: postfix,
      })}${this.slash({
        end: SlashOperations.ADD,
        start: SlashOperations.ADD,
        str: endpoint,
      })}`
      return outUrl
    }
    return `/${this.slash({
      end: SlashOperations.ADD,
      start: SlashOperations.REMOVE,
      str: endpoint,
    })}`
  }

  @action
  public fetchConfig = (): void => {
    this.config = {
      CONSTANTS: {
        DATA_STORAGE:
          (process.env.REACT_APP_CONSTANTS_DATA_STORAGE as DataStorage) || DataStorage.INDEXED_DB,
        TOKEN_STORAGE:
          (process.env.REACT_APP_TOKEN_STORAGE as TokenStorage) || TokenStorage.LOCAL_STORAGE,
        USER_TOKEN: process.env.REACT_APP_USER_TOKEN || '__TOKEN__',
      },
      DATABASE: {
        NAME: process.env.REACT_APP_DATABASE_NAME || 'ironman',
        VERSION: process.env.REACT_APP_DATABASE_VERSION
          ? parseInt(process.env.REACT_APP_DATABASE_VERSION, 10)
          : 1,
      },
      ENDPOINTS: {
        API:
          process.env.REACT_APP_ENDPOINTS_API ||
          'https://dev.pas.sdvor.com/api/bot/ZCL_IRONMAN_API',
        AUTH:
          process.env.REACT_APP_ENDPOINTS_AUTH ||
          'https://dev.pas.sdvor.com/api/bot/ZAUTH_TOKENS_API',
      },
      MOCK: {
        AUTH: !this.isProd,
        PHONE: '+79829320283',
        TOKEN: 'intention030708',
      },
      PAGING: {
        PER_PAGE: 10,
      },
      ROUTES: {
        DUMKA: 'dumka',
        'DUMKA/NEW': 'dumka/new',
        FALLBACK: 'dumka/new',
        GET_CODE: 'get-code',
        GET_TOKEN: 'get-token',
        ROOT: '',
        TASK: 'task',
        'TASK/NEW': 'task/new',
      },
      TIMEOUTS: {
        NOTIFICATION: process.env.REACT_APP_TIMEOUTS_NOTIFICATION
          ? parseInt(process.env.REACT_APP_TIMEOUTS_NOTIFICATION, 10)
          : 3000,
      },
    }
  }

  @action
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

  @action
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
    invariant(this.stores.navigation, 'Стор navigation не определен!')
    ;(this.stores.navigation as INavigationStore).replace(str)
  }

  /**
   * Обертка для функции згыр из стора navigation
   */
  public push = (str: string): void => {
    invariant(this.stores.navigation, 'Стор navigation не определен!')
    ;(this.stores.navigation as INavigationStore).push(str)
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
    invariant(this.stores.notifications, 'Стор Notifications не объявлен!')
    return (this.stores.notifications as INotificationsStore).addNotification(notification)
  }

  /**
   * Обертка для функции удаления уведомлений из стора notification
   */
  public removeNotification = (id: string): NotificationType | null => {
    invariant(this.stores.notifications, 'Стор Notifications не объявлен!')
    return (this.stores.notifications as INotificationsStore).removeNotification(id)
  }

  /**
   * Обертка для функции добавления ошибки из стора errors
   */
  public addError = (errors: ErrorType[]): Array<ErrorType | null> => {
    invariant(this.stores.errors, 'Стор Errors не объявлен!')
    return errors.map(error => (this.stores.errors as IErrorsStore).addError(error))
  }

  /**
   * Обертка для функции удаления ошибки из стора errors
   */
  public removeError = (ids: string[]): Array<ErrorType | null> => {
    invariant(this.stores.errors, 'Стор Errors не объявлен!')
    return ids.map(id => (this.stores.errors as IErrorsStore).removeError(id))
  }

  @action
  public postData = async (remoteUrl: string, body: object, message?: string): Promise<any> => {
    try {
      const requestId = this.startRequest(message || 'Отправляем запрос', {
        storeName: this.storeName,
      })

      const response = await postData(remoteUrl, body)

      this.stopRequest(requestId)

      return response
    } catch (err) {
      if (checkSSL(err.message, remoteUrl)) {
        return
      }

      return err
    }
  }

  @action
  public getData = async (remoteUrl: string, message?: string): Promise<any> => {
    try {
      const requestId = this.startRequest(message || 'Отправляем запрос', {
        storeName: this.storeName,
      })

      const response = await getData(remoteUrl)

      this.stopRequest(requestId)

      return response
    } catch (err) {
      if (checkSSL(err.message, remoteUrl)) {
        return
      }

      return err
    }
  }

  @action
  public putData = async (remoteUrl: string, body: object, message?: string): Promise<any> => {
    try {
      const requestId = this.startRequest(message || 'Отправляем запрос', {
        storeName: this.storeName,
      })

      const response = await putData(remoteUrl, body)

      this.stopRequest(requestId)

      return response
    } catch (err) {
      if (checkSSL(err.message, remoteUrl)) {
        return
      }

      return err
    }
  }

  @action
  public deleteData = async (remoteUrl: string, message?: string): Promise<any> => {
    try {
      const requestId = this.startRequest(message || 'Отправляем запрос', {
        storeName: this.storeName,
      })

      const response = await deleteData(remoteUrl)

      this.stopRequest(requestId)

      return response
    } catch (err) {
      if (checkSSL(err.message, remoteUrl)) {
        return
      }

      return err
    }
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
    invariant(typeof str === 'string', 'str не строка!')
    /**
     * Копируем строку
     */
    let localString: string = str.slice(0, str.length)
    if (start) {
      /**
       * Приводим название операции к нижнему регистру и копируем ее
       */
      const localStart = start.toLowerCase()
      /**
       * Регулярное выражение для проверки
       */
      const regexp = /^\/+/
      invariant(
        Object.values(SlashOperations).includes(localStart),
        'Start должен быть типом SlashOperations!'
      )
      if (localStart === SlashOperations.ADD) {
        if (!regexp.test(localString)) {
          localString = `/${localString}`
        }
      } else if (localStart === SlashOperations.REMOVE) {
        if (regexp.test(localString)) {
          localString = localString.replace(regexp, '')
        }
      }
    }
    if (end) {
      /**
       * Приводим название операции к нижнему регистру и копируем ее
       */
      const localEnd = end.toLowerCase()
      /**
       * Регулярное выражение для проверки
       */
      const regexp = /\/+$/
      invariant(
        Object.values(SlashOperations).includes(localEnd),
        'End должен быть типом SlashOperations!'
      )
      if (localEnd === SlashOperations.ADD) {
        if (!regexp.test(localString)) {
          localString = `${localString}/`
        }
      } else if (localEnd === SlashOperations.REMOVE) {
        if (regexp.test(localString)) {
          localString = localString.replace(regexp, '')
        }
      }
    }
    return localString
  }
}

export default Configuration
