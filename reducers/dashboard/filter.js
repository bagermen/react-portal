import m from 'moment-timezone';
import {
  DASHBOARD_DATE_RANGE_CHANGE,
  DASHBOARD_FILTER_SET_ITEMS,
  DASHBOARD_FILTER_ADD_ITEM,
  DASHBOARD_FILTER_REMOVE_ITEM,
  DASHBOARD_FILTER_CLEAR_ITEMS
} from '../../actions/dashboard';

const initialState = {
  tz: m.tz.guess(),
  startDate: 0,
  endDate: 0,
  period: 'today',
  filters: [],
  color: 'grey'
};
export default function(state = initialState, action = {}) {

  switch (action.type) {
    case DASHBOARD_DATE_RANGE_CHANGE:

      return {...state, ...action.value};
    case DASHBOARD_FILTER_SET_ITEMS:

        return {...state, ...{ filters: action.value }};
    case DASHBOARD_FILTER_ADD_ITEM:
      const filters = state.filters.slice();

      filters.push({
        filterId: action.filterId,
        filterType: action.filterType,
        value: action.value,
        serverValue: action.serverValue,
        userValue: action.userValue,
        color: action.color
      });

      return {...state, ...{ filters }};
    case DASHBOARD_FILTER_REMOVE_ITEM:
      const filteredFilters = state.filters.filter((filter) => {
        return filter.filterId != action.filterId;
      });

      return {...state, ...{ filters: filteredFilters }};
    case DASHBOARD_FILTER_CLEAR_ITEMS:
        return {...state, ...{ filters: [] }};
    default:

        return state;
  }
}