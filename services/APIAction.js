import jwttok from "./JWTToken";
import axios from "axios";
import baseconfig from '../config.json';
import {store} from '../containers/Root';
import { setLoadingState } from '../actions/index';

/**
 * @see https://github.com/axios/axios
 */
class APIAction {
  constructor(baseURL = baseconfig.backend) {
    this.auth = null;
    this.baseURL = baseURL;
  }

  changeBase(baseURL) {
    this.baseURL = baseURL;
  }
  setAuth(auth) {
    this.auth = auth;
  }

  getAuth() {
    return this.auth;
  }

  /**
   * Return
   * @param {*} useAuth
   */
  async getJwtToken(useAuth) {
    let auth = this.getAuth(),
        sessionData;

    if (auth && useAuth) {
      sessionData = await auth.getSession();

      if (sessionData && sessionData.session) {
        return sessionData.session.getAccessToken().getJwtToken();
      }
    }

    return jwttok.getToken();
  }
/**
 * Get axious instance
 * @param {*} useAuth
 * @param {*} config
 */
  async getApi(useAuth = false, config = {}) {
    let authToken,
      configInitial = {
        baseURL: this.baseURL,
        headers: {
          "X-COLUMBIA-SYSTEM": "CUSTOMER_PORTAL"
        }
      };

    authToken = await this.getJwtToken(useAuth);
    configInitial.headers.Authorization = "Bearer " + authToken;

    const instance = axios.create({...configInitial, config});

    instance.interceptors.request.use((config) => {
      store.dispatch(setLoadingState(true));
      return config;
    }, (error) => {
      store.dispatch(setLoadingState(false));
      return Promise.reject(error);
    });

    instance.interceptors.response.use((response) => {
      store.dispatch(setLoadingState(false));
      return response;
    }, (error) => {
      store.dispatch(setLoadingState(false));
      return Promise.reject(error);
    });

    return instance;
  }
  /**
   * axios request
   */
  async request(config, useAuth = false) {
    const initial = await this.getApi(!!useAuth, {});

    return initial.request(config);
  }
  /**
   * Get data
   * @param {String} url
   * @param {Object} config
   * @param {Bool} useAuth
   */
  async get(url, ...args) {
    let [config, useAuth] = args;

    if (typeof config !== 'object') {
      useAuth = config;
      config = {};
    }

    const initial = await this.getApi(!!useAuth, {});

    return initial.get(url, config);
  }
  /**
   * Delete Data
   * @param {String} url
   * @param {Object} config
   * @param {Bool} useAuth
   */
  async delete(url, ...args) {
    let [config, useAuth] = args;

    if (typeof config !== 'object') {
      useAuth = config;
      config = {};
    }

    const initial = await this.getApi(!!useAuth, {});

    return initial.delete(url, config);
  }
  /**
   * Head request
   * @param {String} url
   * @param {Object} config
   * @param {Bool} useAuth
   */
  async head(url, ...args) {
    let [config, useAuth] = args;

    if (typeof config !== 'object') {
      useAuth = config;
      config = {};
    }

    const initial = await this.getApi(!!useAuth, {});

    return initial.head(url, config);
  }
  /**
   * Options request
   * @param {String} url
   * @param {Object} config
   * @param {Bool} useAuth
   */
  async options(url, ...args) {
    let [config, useAuth] = args;

    if (typeof config !== 'object') {
      useAuth = config;
      config = {};
    }

    const initial = await this.getApi(!!useAuth, {});

    return initial.options(url, config);
  }
  /**
   * Post request
   * @param {String} url
   * @param {Object} data
   * @param {Object} config
   * @param {Bool} useAuth
   */
  async post(url, ...args) {
    let [data, config, useAuth] = args;

    if (typeof config !== 'object') {
      useAuth = config;
      config = {};
    }

    const initial = await this.getApi(!!useAuth, {});

    return initial.post(url, data, config);
  }
  /**
   * Put request
   * @param {String} url
   * @param {Object} data
   * @param {Object} config
   * @param {Bool} useAuth
   */
  async put(url, ...args) {
    let [data, config, useAuth] = args;

    if (typeof config !== 'object') {
      useAuth = config;
      config = {};
    }

    const initial = await this.getApi(!!useAuth, {});

    return initial.put(url, data, config);
  }

  /**
   * Patch request
   * @param {String} url
   * @param {Object} data
   * @param {Object} config
   * @param {Bool} useAuth
   */
  async patch(url, ...args) {
    let [data, config, useAuth] = args;

    if (typeof config !== 'object') {
      useAuth = config;
      config = {};
    }

    const initial = await this.getApi(!!useAuth, {});

    return initial.patch(url, data, config);
  }
  /**
   * Generate URI based on
   * @param {Object} config
   * @param {Bool} useAuth
   */
  async getUri(config, useAuth = false) {
    const initial = await this.getApi(!!useAuth, {});

    return initial.getUri(config);
  }
  /**
   * Alias for 'get'
   * @param {Object} DataURL
   * @param {Bool} user
   * @return Promise
   */
  getData(DataURL, user) {
    return this.get(DataURL, user);
  }

  /**
   * Alias for 'delete'
   * @param {*} DataURL
   * @param {*} user
   * @return Promise
   */
  delData(DataURL, user) {
    return this.delete(DataURL, user);
  }
  /**
   * Alias for 'post'
   * @param {String} DataURL
   * @param {Object} DataForm
   * @param {Bool} user
   * @return Promise
   */
  postData(DataURL, DataForm, user) {
    return this.post(DataURL, DataForm, user);
  }
  /**
   * Alias for 'put'
   * @param {String} DataURL
   * @param {Object} DataForm
   * @param {Bool} user
   * @return Promise
   */
  putData(DataURL, DataForm, user) {
    return this.put(DataURL, DataForm, user);
  }
}

export default new APIAction();
export const api = new APIAction(baseconfig.dataserver);
export { APIAction };
