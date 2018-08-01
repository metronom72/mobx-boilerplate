import { observable } from 'mobx';

export class ApplicationStore {
  storeName = "application";

  @observable variable = null

  setConfiguration = configuration => {
    this.configuration = configuration;
  }
}

export default ApplicationStore;
