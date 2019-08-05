import DraftConfigurationStore from '@@store/configuration/draft'
import { IConfigurationStore } from '@@store/configuration/types'
import { ErrorType, IErrorsStore } from '@@store/error/types'
import invariant from 'invariant'
import { action, observable } from 'mobx'
import uuid from 'uuid'

export class Errors implements IErrorsStore {
  public readonly storeName: string = 'Errors'
  public configuration: IConfigurationStore = DraftConfigurationStore

  @observable public errors: ErrorType[] = []

  @action public addError = (error: ErrorType) => {
    const err: ErrorType = { ...error }
    /**
     * Устанавливаем идентификатор для ошибки
     */
    if (!error.id) {
      err.id = uuid.v4()
    }
    /**
     * Выставляем дату создания
     */
    if (!error.createdAt) {
      err.createdAt = new Date()
    }
    this.errors.push(err)

    return err
  }

  @action
  public resetErrors = (storeName: string) => {
    invariant(storeName, 'Название стора является обязательным параметром!')
    this.errors = this.errors.filter(
      (err: ErrorType) => err.storeName && err.storeName.toLowerCase() !== storeName.toLowerCase()
    )
    return storeName
  }

  @action
  public removeError = (id: string): ErrorType | null => {
    invariant(id, 'ID ошибки не указан!')
    const found: ErrorType | null = this.errors.find(err => err.id === id) || null
    if (found) {
      this.errors = this.errors.filter(err => err.id !== id)
    }

    /**
     * Возвращаем найденное значение
     */
    return found
  }

  @action
  public setConfiguration = async (configuration: IConfigurationStore): Promise<void> => {
    invariant(!!configuration.config, 'Конфигурация корректно не инициализирована')
    this.configuration = configuration
  }
}

export default Errors
