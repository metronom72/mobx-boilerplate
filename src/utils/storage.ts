import { IConfigurationStore } from '@@store/configuration/types'
import { ErrorType } from '@@store/error/types'

// tslint:disable-next-line: no-empty-interface
interface YourType {}

import {
  AndDataTypes,
  DatabaseTablesEnum,
  IStorage,
  OrDataTypes,
  StorageQuery,
  StorageResult,
} from '@@store/types'
import Dexie from 'dexie'
import invariant from 'invariant'

const generateError = (error: Error): ErrorType => ({
  createdAt: new Date(),
  message: error.message,
  storeName: null,
})

const returnError = (error: Error, collection: DatabaseTablesEnum) => ({
  collection,
  errors: [generateError(error)],
  value: null,
})

const generateStorageResult = (
  collection: DatabaseTablesEnum,
  value: Dexie.Collection<any, string> | null
) => ({
  collection,
  errors: [],
  value: value || null,
})

export class Storage extends Dexie implements IStorage {
  public [DatabaseTablesEnum.TABLE_NAME]: Dexie.Table<YourType, string>

  private DEFAULT: {
    PER_PAGE: number
  }

  private configuration: IConfigurationStore

  constructor(configuration: IConfigurationStore) {
    super(configuration.config!.DATABASE.NAME)
    invariant(!!configuration.config, 'Конфигурация не инициализирована корректно')

    const { config } = configuration

    this.configuration = configuration

    this.DEFAULT = {
      PER_PAGE: config!.PAGING.PER_PAGE,
    }

    this.version(config!.DATABASE.VERSION).stores({
      [DatabaseTablesEnum.TABLE_NAME]: '++id,title,createdAt',
    })

    this[DatabaseTablesEnum.TABLE_NAME] = this.table(DatabaseTablesEnum.TABLE_NAME)
  }

  public remove = async (
    collection: DatabaseTablesEnum,
    query: StorageQuery
  ): Promise<StorageResult> => {
    try {
      await this[collection].where(query).delete()
      return generateStorageResult(collection, null)
    } catch (err) {
      if (this.configuration.isDev) {
        // tslint:disable-next-line: no-console
        console.log(collection, query, err)
      }
      return returnError(err, collection)
    }
  }

  public update = async (
    collection: DatabaseTablesEnum,
    query: StorageQuery,
    value: OrDataTypes
  ): Promise<StorageResult> => {
    try {
      await this[collection].where(query).modify(value)
      const result = await this[collection].where(query)
      return generateStorageResult(collection, result)
    } catch (err) {
      if (this.configuration.isDev) {
        // tslint:disable-next-line: no-console
        console.log(collection, query, value, err)
      }
      return returnError(err, collection)
    }
  }

  public get = async (
    collection: DatabaseTablesEnum,
    query?: StorageQuery
  ): Promise<StorageResult> => {
    try {
      const result = query
        ? await this[collection].where(query)
        : await this[collection].orderBy(':id')
      return generateStorageResult(collection, result)
    } catch (err) {
      if (this.configuration.isDev) {
        // tslint:disable-next-line: no-console
        console.log(collection, query, err)
      }
      return returnError(err, collection)
    }
  }

  public add = async (
    collection: DatabaseTablesEnum,
    value: OrDataTypes
  ): Promise<StorageResult> => {
    try {
      const id = await this[collection].add(value as AndDataTypes)
      const result = await this.get(collection, { id })
      return generateStorageResult(collection, result.value)
    } catch (err) {
      if (this.configuration.isDev) {
        // tslint:disable-next-line: no-console
        console.log(collection, value, err)
      }
      return returnError(err, collection)
    }
  }

  public page = async (
    collection: DatabaseTablesEnum,
    page: number = 1,
    perPage?: number,
    query?: StorageQuery
  ): Promise<StorageResult> => {
    perPage = perPage || this.DEFAULT.PER_PAGE
    page = page || 1
    try {
      let result: Dexie.Collection<any, string> | null

      if (query) {
        result = (await this.get(collection, query)).value
      } else {
        result = await this[collection]
          .orderBy(':id')
          .offset((page - 1) * (perPage || this.DEFAULT.PER_PAGE))
          .limit(perPage)
      }
      return generateStorageResult(collection, result)
    } catch (err) {
      return returnError(err, collection)
    }
  }
}
