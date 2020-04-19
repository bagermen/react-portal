import { api } from '../services/APIAction';
import m from 'moment-timezone';
import {
  API_POST_DASHBOARD
} from '../constants/endpoints';
import dashbard from '../services/dashboard';
/**
 * Dashboard actions
 */
export const DASHBOARD_DATE_RANGE_CHANGE = 'DASHBOARD_DATE_RANGE_CHANGE';
export const DASHBOARD_UPDATE_COMMON_DATA = 'DASHBOARD_UPDATE_COMMON_DATA';
export const DASHBOARD_FILTER_SET_ITEMS = 'DASHBOARD_FILTER_SET_ITEMS';
export const DASHBOARD_FILTER_ADD_ITEM = 'DASHBOARD_FILTER_ADD_ITEM';
export const DASHBOARD_FILTER_REMOVE_ITEM = 'DASHBOARD_FILTER_REMOVE_ITEM';
export const DASHBOARD_FILTER_CLEAR_ITEMS = 'DASHBOARD_FILTER_CLEAR_ITEMS';
export const DASHBOARD_LOAD_DATA = 'DASHBOARD_LOAD_DATA';
export const DASHBOARD_CLEAR_DATA = 'DASHBOARD_CLEAR_DATA';

export function updateDateRange(data) {
  return {
    type: DASHBOARD_DATE_RANGE_CHANGE,
    value: data
  }
}
export function updateTotalData(data) {
  return {
    type: DASHBOARD_UPDATE_COMMON_DATA,
    value: data
  }
}
export function setFilters(items = []) {
  return {
    type: DASHBOARD_FILTER_SET_ITEMS,
    value: items.reduce((all, item) => {
      if ('value' in item && 'serverValue' in item && 'userValue' in item && 'filterType' in item) {
        if ('filterId' in item) {
          all.push({
            filterId: item.filterId,
            filterType: item.filterType,
            value: item.value,
            serverValue: item.serverValue,
            userValue: item.userValue,
            color: item.color
          });
        } else if ('type' in item) {
          all.push({
            filterId: `${item.type}:${item.value}`,
            filterType: item.filterType,
            value: item.value,
            serverValue: item.serverValue,
            userValue: item.userValue,
            color: item.color
          });
        }
      }

      return all;
    }, [])
  }
}
export function addFilter({filterType, value, serverValue, userValue, color}) {
  return {
    type: DASHBOARD_FILTER_ADD_ITEM,
    filterId: `${filterType}:${value}`,
    filterType,
    value,
    serverValue,
    userValue,
    color
  }
}
export function removeFilterValue(filterId) {
  return {
    type: DASHBOARD_FILTER_REMOVE_ITEM,
    filterId
  }
}
export function clearFilters() {
  return {
    type: DASHBOARD_FILTER_CLEAR_ITEMS
  }
}

export function loadDashboard({period, tz, startDate, endDate, filters = []}) {
  return (dispatch, getState) => {
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    let params = {
      timezone: tz,
      period: period,
      filters: {}
    };
    m.tz.setDefault(tz);

    if (period == 'custom') {
      params.rangeStart = m.unix(startDate).format(dateFormat);
      params.rangeEnd = m.unix(endDate).format(dateFormat);
    }

    filters.forEach((filter) => {
      params.filters = {...params.filters, ...filter.serverValue};
    });

    return api.post(API_POST_DASHBOARD, params, true)
      .then(({data}) => {

        dashbard.parseData(data).then((result) => {
          dispatch(updateTotalData(result.total));
          dispatch({
            type: DASHBOARD_LOAD_DATA,
            value: result.charts
          });
        });
      })
      .catch(() => {
        dispatch({
          type: DASHBOARD_CLEAR_DATA
        });
      });
  };
}