export const USER_SET_DATA = 'USER_SET_DATA';
export const USER_CLEAR_DATA = 'USER_CLEAR_DATA';

export const USER_CHANGE_ISMEM = 'USER_CHANGE_ISMEM';

export const RECEIVE_DATA = 'RECEIVE_DATA';
export const DELETE_DATA = 'DELETE_DATA';
export const SENT_DATA = 'SENT_DATA';

export const CHANGE_LOADING_STATUS = 'CHANGE_LOADING_STATUS';

export function setUserData(data) {
  if (typeof data != 'object') {
    data = {};
  }

  return {
    type : USER_SET_DATA,
    data
  };
}

export function clearUserData() {
  return {
    type : USER_CLEAR_DATA
  };
}

export function changeIsMem(data) {
  return {
    type: USER_CHANGE_ISMEM,
    value: Array.isArray(data['cognito:groups']) && data['cognito:groups'].indexOf('member') > -1
  };
}

export function setLoadingState(loading) {
  return {
    type: CHANGE_LOADING_STATUS,
    value: !!loading
  };
}