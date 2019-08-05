import { ICommonStore } from '@@store/types'
import { History } from 'history'

/** navigation store */
export interface INavigationStore extends ICommonStore {
  /**
   * router's history
   */
  history: History
  /**
   * router's location
   */
  location: Location | null
  /**
   * router's push
   */
  push: (location: string) => void
  /**
   * router's replace
   */
  replace: (location: string) => void
  /**
   * router's go
   */
  go: (n: number) => void
  /**
   * router's goBack
   */
  goBack: () => void
  /**
   * router's goForward
   */
  goForward: () => void
  /**
   * Строка запроса
   */
  query: string
}
