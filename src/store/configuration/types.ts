import { ErrorType } from '@@store/error/types'
import { NotificationType } from '@@store/notification/types'
import { ICommonStore, IEditableStore, IStore } from '@@store/types'

export interface IConfigurationStore extends IStore, INetwork, IEnvironment, IEditableStore {
  /**
   * Объект всех доступных сторов
   */
  stores: { [storeNameLowerCase: string]: ICommonStore }
  /**
   * Интерфейс представляющий собой объект конфигурации
   */
  config: IConfiguration
  /**
   * Обязательный префикс для всех роутов
   */
  base: string
  /**
   * Флаг корректности конфигурации
   */
  configured: boolean
  /**
   * Флаг онлайн/оффлайн
   */
  online: boolean
  /**
   * Создать обычную ссылку
   */
  createUrl: (arg: string) => string
  /**
   * Создать ссылку для обращения к бэкэнду
   */
  createBackendUrl: (arg: string, postfix: string) => string
  /**
   * Создать абсолютную ссылку на основании поля location.origin
   */
  createAbsoluteUrl: (arg: string) => string
  /**
   * Вызов replace из навигации
   */
  replace: (url: string) => void
  /**
   * Вызов push из навигации
   */
  push: (url: string) => void
  /**
   * Создание уведомления
   */
  addNotification: (notification: {
    id?: string
    message: string
    createdAt?: Date
    storeName: string
    timeout?: number | null
  }) => NotificationType
  /**
   * Удаление уведомления
   */
  removeNotification: (id: string) => NotificationType | null
  /**
   * Добавление ошибки
   */
  addError: (errors: ErrorType[]) => Array<ErrorType | null>
  /**
   * Удаление ошибки
   */
  removeError: (ids: string[]) => Array<ErrorType | null>

  postData: (url: string, body: object, message?: string) => Promise<any>

  getData: (url: string, message?: string) => Promise<any>

  putData: (url: string, body: object, message?: string) => Promise<any>

  deleteData: (url: string, message?: string) => Promise<any>

  refetch: () => Promise<void>
}

/** config.json */
export interface IConfiguration {
  /**
   * Объект констант для спецификации эндпоинтов
   */
  ENDPOINTS: IEndpointsConstants
  /**
   * Объект общих констант
   */
  CONSTANTS: IConfigurationConstants
  /**
   * Объект констант таймеров
   */
  TIMEOUTS: ITimeoutConstants
  /**
   * Доступные маршруты
   */
  ROUTES: IRoutes
  /**
   * Флаги отключенных скоупов
   */
  MOCK: IMocks
  /**
   * Конфигурация базы данных
   */
  DATABASE: IDatabase
  /**
   * Конфигурация для пагинации
   */
  PAGING: IPaging
}

export interface IPaging {
  PER_PAGE: number
}

export interface IDatabase {
  /**
   * Название базы данных
   */
  NAME: string
  /**
   * Версия базы данных
   */
  VERSION: number
}

// tslint:disable-next-line: no-empty-interface
export interface IMocks {}

export interface IRoutes {
  [key: string]: string
  DUMKA: string
  'DUMKA/NEW': string
  FALLBACK: string
  GET_CODE: string
  GET_TOKEN: string
  ROOT: string
  TASK: string
  'TASK/NEW': string
}

export enum TokenStorage {
  COOKIES = 'cookies',
  LOCAL_STORAGE = 'localStorage',
}

export enum DataStorage {
  // LOCAL_STORAGE = 'localStorage',
  INDEXED_DB = 'indexedDB',
}

/** config.json */
export interface IConfigurationConstants {
  /**
   * Название пользовательского токена
   */
  USER_TOKEN: string
  /**
   * Место хранения пользовательского токена
   */
  TOKEN_STORAGE: TokenStorage
  /**
   * Место хранения данных
   */
  DATA_STORAGE: DataStorage
}

export interface ITimeoutConstants {
  /**
   * Задержка для удаления нтификаций
   */
  NOTIFICATION: number
}

/** config.json */
export interface IEndpointsConstants {
  /**
   * Эндпоинт для авторизации
   */
  AUTH: string
  /**
   * Общий эндпоинт для обращения к бэкэнду
   */
  API?: string
}

export interface IRequest {
  id: NodeJS.Timeout | string
  message: string
}

/** network store */
export interface INetworkConfiguration {
  /**
   * Массив активных запросов
   */
  requests: IRequest[]
  /**
   * Сообщение пользвоателю
   */
  message: string | null
}

/** network store */
export interface INetworkRequest {
  /**
   * id запроса
   */
  id: NodeJS.Timeout
  /**
   * Сообщение-комментарий к запросу
   */
  message: string
}

export interface INetwork {
  /**
   * Флаг показывающий что в данный момент выполняется запрос
   */
  readonly isFetching: boolean
  /**
   * Функция начала запроса
   */
  startRequest: (message: string, request: any) => NodeJS.Timeout
  /**
   * Функция остановки запроса
   */
  stopRequest: (id: NodeJS.Timeout) => void
  /**
   * Интерфейс хранящий информацию обо всех активных запросах
   */
  network: INetworkConfiguration
}

export interface IEnvironment {
  /**
   * is production mode?
   */
  readonly isProd: boolean
  /**
   * is development mode?
   */
  readonly isDev: boolean
  /**
   * is test mode?
   */
  readonly isTest: boolean
}

/** configuration store */
export enum SlashOperations {
  ADD = 'add',
  REMOVE = 'remove',
}

/** configuration store */
export enum Environments {
  'prod',
  'test',
  'dev',
  'development',
}
