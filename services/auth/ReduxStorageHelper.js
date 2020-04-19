import {
  setItem,
  removeItem,
  clear,
  setAuthenticated,
  updatePayload,
  clearPayload
} from '../../actions/aws_user';

import { setLoadingState } from '../../actions/index';

let dataMemory = {};
export default class ReduxStorageHelper {
  constructor(store, path) {
    this.store = store;
    this.path = path;

    dataMemory = {...(this.store.getState()[path] || {})};
  }

  /**
   * This is used to set a specific item in storage
   * @param {string} key - the key for the item
   * @param {object} value - the value
   * @returns {string} value that was set
   */
  setItem(key, value) {
    this.store.dispatch(setItem(key, value));
    dataMemory[key] = value;

    return value;
  }

  /**
   * This is used to get a specific key from storage
   * @param {string} key - the key for the item
   * This is used to clear the storage
   * @returns {string} the data item
   */
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(dataMemory, key) ? dataMemory[key] : undefined;
  }

  /**
   * This is used to remove an item from storage
   * @param {string} key - the key being set
   * @returns {string} value - value that was deleted
   */
  removeItem(key) {
    this.store.dispatch(removeItem(key));

    return delete dataMemory[key];
  }

  /**
   * This is used to clear the storage
   * @returns {string} nothing
   */
  clear() {
    this.store.dispatch(clear());
    dataMemory = {};

    return dataMemory;
  }
  /**
   * Set isAuthenticated flag
   * @param {*} authenticated
   */
  setAuthenticated(authenticated) {
    this.store.dispatch(setAuthenticated(authenticated));

    return !!authenticated;
  }

  /**
   * Get isAuthenticated flag
   */
  getAuthenticated() {
    const state = this.store.getState()[this.path];

    return state && state.isAuthenticated;
  }

  updatePayload(data) {

    this.store.dispatch(updatePayload(data));
  }

  clearPayload() {
    this.store.dispatch(clearPayload());
  }

  setLoadingState(state) {
    this.store.dispatch(setLoadingState(state));
  }
}