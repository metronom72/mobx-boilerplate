import { ICommonStore } from '@@store/types'

/** errors store */
export interface ErrorType {
  /**
   * Указатель на то из какого стора пришла ошибка
   */
  storeName: string | null
  /**
   * Сообщение об ошибки
   */
  message: string
  /**
   * Дата создания ошибки
   */
  createdAt?: Date
  /**
   * Идентификатор ошибки
   */
  id?: string
  /**
   * Дополнительная информация об ошибке
   */
  meta?: {
    /**
     * Поле в котором произошла ошибка
     */
    field?: string
  }
}

/** errors store */
export interface IErrorsStore extends ICommonStore {
  /**
   * Массив активных ошибок
   */
  errors: ErrorType[]
  /**
   * Функция для сброса ошибко определенного стора
   */
  resetErrors: (storeName: string) => string
  /**
   * Функция для добавления новой ошибки
   */
  addError: (error: ErrorType) => ErrorType
  /**
   * Функция для удаления ошибки
   */
  removeError: (id: string) => ErrorType | null
}
