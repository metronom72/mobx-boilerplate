import DraftConfigurationStore from '@@store/configuration/draft'
import { IConfigurationStore } from '@@store/configuration/types'
import { INavigationStore } from '@@store/navigation/types'
import { createBrowserHistory, History } from 'history'
import invariant from 'invariant'
import { action, computed, observable } from 'mobx'

export class Navigation implements INavigationStore {
  public readonly storeName: string = 'Navigation'

  @observable
  public location: Location | null = null

  @observable
  public history: History = createBrowserHistory()

  public configuration: IConfigurationStore = DraftConfigurationStore

  @action
  public setConfiguration = async (configuration: IConfigurationStore): Promise<void> => {
    invariant(!!configuration.config, 'Конфигурация корректно не инициализирована')
    this.configuration = configuration
  }

  @action
  public push = (location: string): void => {
    invariant(this.history, 'История не инициализирована')
    invariant(location, 'location не передан')
    this.history.push(location)
  }

  @action
  public replace = (location: string): void => {
    invariant(this.history, 'История не инициализирована')
    invariant(location, 'location не передан')
    this.history.replace(location)
  }

  @action
  public go = (n: number): void => {
    invariant(this.history, 'История не инициализирована')
    this.history.go(n)
  }

  @action
  public goBack = (): void => {
    invariant(this.history, 'История не инициализирована')
    this.history.goBack()
  }

  @action
  public goForward = (): void => {
    invariant(this.history, 'История не инициализирована')
    this.history.goForward()
  }

  @computed
  public get query(): string {
    return window.location.search
  }
}

export default Navigation
