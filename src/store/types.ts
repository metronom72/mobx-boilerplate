import { IConfigurationStore } from '@@store/configuration/types'
import { ErrorType } from '@@store/error/types'
import Dexie, { IndexableType } from 'dexie'

/** generic store */
export interface IStore {
  readonly storeName: string
}

export interface ICommonStore extends IStore {
  /**
   * единый объект конфигуарции
   */
  configuration: IConfigurationStore
  /**
   * Функция вызываемая при инициализации конфигурации
   */
  setConfiguration: (configuration: IConfigurationStore) => Promise<void>
}

export interface ActionStatus<Model> {
  created?: boolean
  updated?: boolean
  removed?: boolean
  errors: ErrorType[]
  value?: Model
}

export interface ICreatable<Model> {
  create: () => Promise<ActionStatus<Model>>
}

export interface IUpdatable<Model> {
  update: () => Promise<ActionStatus<Model>>
}

export interface IRemovable<Model> {
  remove: () => Promise<ActionStatus<Model>>
}

export interface ISyncable<Model> {
  lastSync: Date | null
  synced: boolean
  isSyncing: boolean
  sync: (minDelay: number, maxDelay: number) => Promise<ActionStatus<Model>>
}

export interface IFetchable<Model> {
  fetchAll: () => Promise<Model[] | null>
  fetching: boolean
}

export interface ICommonModel<Model> {
  data: Model
  isValid: boolean
}

export interface ICommonCollection<Model> {
  items: Array<ICommonModel<Model>>
}

export enum FieldTypes {
  TOGGLE = 'toggle',
  CHECKBOX = 'checkbox',
  INPUT = 'input',
  SELECT = 'select',
  JSON = 'json',
}

export interface IDataView {
  fieldName: string
  fieldType: FieldTypes
  title: string
  variants?: Array<{ value: any; label: string }>
  editable?: boolean
}

export interface IEditableStore {
  editable: boolean
  rows: IDataView[]
}

export type OrDataTypes = any
export type AndDataTypes = any

/**
 * Доступные таблицы в кэше
 */
export enum DatabaseTablesEnum {
  DUMKAS = 'dumkas',
  TASKS = 'tasks',
  TAGS = 'tags',
  CLIENTS = 'clients',
  MANAGERS = 'managers',
}

/**
 * Интерфейс запросов к кэшу
 */
export interface StorageQuery {
  [key: string]: IndexableType
}

/**
 * Возвращаемый результат операций в кэше
 */
export interface StorageResult {
  /**
   * Коллекция из которой взята запись
   */
  collection: DatabaseTablesEnum
  /**
   * Найденное значение
   * Если  в процессе выполнения возникли ошибки, то вернется null
   */
  value: Dexie.Collection<any, string> | null
  /**
   * Возникшие ошибки
   */
  errors: ErrorType[]
}

/**
 * Интерфейс Кэша
 */
export interface IStorage {
  /**
   * Выборка одной или нескольких записей
   */
  get: (collection: DatabaseTablesEnum, query?: StorageQuery) => Promise<StorageResult>
  /**
   * Добавление новой записи
   */
  add: (collection: DatabaseTablesEnum, value: OrDataTypes) => Promise<StorageResult>
  /**
   * Обновление одной записи
   */
  update: (
    collection: DatabaseTablesEnum,
    query: StorageQuery,
    value: OrDataTypes
  ) => Promise<StorageResult>
  /**
   * Удаление одной записи
   */
  remove: (collection: DatabaseTablesEnum, query: StorageQuery) => Promise<StorageResult>
  /**
   * Получение отдельной страницы записей из хранилища
   */
  page: (
    collection: DatabaseTablesEnum,
    /**
     * Номер страницы
     */
    page?: number,
    /**
     * Количество элементов на странице
     */
    perPage?: number
  ) => Promise<{
    /**
     * Коллекция из которой взята запись
     */
    collection: DatabaseTablesEnum
    /**
     * Найденное значение
     * Если  в процессе выполнения возникли ошибки, то вернется null
     */
    value: Dexie.Collection<any, string> | null
    /**
     * Возникшие ошибки
     */
    errors: ErrorType[]
  }>
}
