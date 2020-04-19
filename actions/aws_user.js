import { changeIsMem } from './index.js';
export const AWS_USER_SET = 'AWS_USER_SET';
export const AWS_USER_REMOVE = 'AWS_USER_REMOVE';
export const AWS_USER_CLEAR = 'AWS_USER_CLEAR';
export const AWS_SET_AUTH_FLAG = 'AWS_SET_AUTH_FLAG';
export const AWS_PAYLOAD_UPDATE = 'AWS_PAYLOAD_UPDATE';
export const AWS_PAYLOAD_CLEAR = 'AWS_PAYLOAD_CLEAR';

export function setItem(key, value) {
  return {
    type: AWS_USER_SET,
    key,
    value
  };
}

export function removeItem(key) {
  return {
    type: AWS_USER_REMOVE,
    key
  };
}

export function clear() {
  return {
    type: AWS_USER_CLEAR
  };
}

export function setAuthenticated(value) {
  return {
    type: AWS_SET_AUTH_FLAG,
    value: !!value
  };
}

export function updatePayload(value) {
  return (dispatch, getState) => {
    dispatch(changeIsMem(value));

    return {
      type: AWS_PAYLOAD_UPDATE,
      value: value
    };
  };
}

export function clearPayload() {
  return {
    type: AWS_PAYLOAD_CLEAR
  };
}