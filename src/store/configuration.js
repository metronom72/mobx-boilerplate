import { observable, action, computed } from 'mobx';
import { getData } from './apiHelpers';
import config from '../default.config.json';
import url from 'url';

export class Configuration {
  constructor(...stores) {
    stores.map(store => {
      if (store.setConfiguration) store.setConfiguration(this);
      else throw new Error();
      if (store.storeName) this.stores[store.storeName] = store;
    });
    this.environment = process.env.NODE_ENV;

    this.fetchConfig();
  }

  @observable config = null
  @observable network = {
    requests: [],
    message: null,
  }
  @observable base = this.trailSlash(
    // process.env.REACT_APP_BASE_URL || url.parse(window.document.getElementsByTagName('base')[0].href).pathname);
    process.env.REACT_APP_BASE_URL &&
    this.addStartSlash(process.env.REACT_APP_BASE_URL) ||
    url.parse(window.document.getElementsByTagName('base')[0].href).pathname);
  @observable configured = false;

  // Неизменяемые переменные. Задаются в момент конфигурации
  environment = null;
  stores = {};

  @computed
  get isFetching() {
    return this.network.requests.length > 0;
  }

  @action
  fetchConfig = () => {
    const requestId = this.startRequest('Конфигурация');
    const url = `${this.trailSlash(process.env.REACT_APP_CONFIG, true) || ''}config.json`;

    getData(url)
      .then(response => {
        this.config = response.data;
        this.configured = true;

        this.stopRequest(requestId);
      })
      .catch(err => {
        if (!this.isProd()) {
          this.config = config;
          this.configured = true;

          this.stopRequest(requestId);
        } else throw new Error('Please specify config.json');
      });
  }

  @action
  startRequest = (message, request = {}) => {
    const requestId = setTimeout(() => {
      request = {
        id: requestId,
        message: message,
        ...request,
      };

      this.network.requests.push(request);
      if (message) this.network.message = message;
    }, 300);

    return requestId;
  }

  @action
  stopRequest = id => {
    if (id) {
      const found = this.network.requests.find(request => request.id === id);
      if (found) {
        this.network.requests = this.network.requests.filter(request => request.id !== id);
      } else clearTimeout(id);
    }
  }

  trailSlash = (string, withSlash = false) => {
    if (string) {
      const endsWithSlash = string.endsWith('/');
      if (endsWithSlash && withSlash) return string;
      if (!endsWithSlash && !withSlash) return string;
      if (endsWithSlash && !withSlash) return string.substring(0, string.length - 1);
      if (!endsWithSlash && withSlash) return string + '/';
    } else return null;
  }

  addStartSlash = string => {
    return string && string.startsWith('/') ? string : `/${string}` || string;
  }

  createUrl = postfix => {
    const url = `${this.trailSlash(this.base)}${this.trailSlash(postfix, true)}`;
    return url;
  }

  createAbsoluteUrl = postfix => {
    const origin = window.location.origin;
    const url = `${this.trailSlash(origin)}/${this.trailSlash(postfix, true)}`;
    return url;
  }

  createBackendUrl = endpoint => {
    endpoint = endpoint.replace(/^\//, '');
    const url = `${this.trailSlash(this.config.BACKEND_ENDPOINT)}/${this.trailSlash(endpoint)}`;
    return url;
  }

  isProd = () => this.environment === 'production'
  isDev = () => this.environment === 'development'
  isTest = () => this.environment === 'test'
}

export default Configuration;
